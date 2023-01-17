<script lang="ts">
	import { onMount } from 'svelte';
	import * as pdfjs from 'pdfjs-dist';
	import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
	import downloadsvg from './assets/toolbarDownload.svg?url';
	import printsvg from './assets/toolbarPrint.svg?url';
	import zoominsvg from './assets/toolbarZoomIn.svg?url';
	import zoomoutsvg from './assets/toolbarZoomOut.svg?url';
	import spreadsvg from './assets/toolbarPageView.svg?url';
	import gapsvg from './assets/toolbarPageGap.svg?url';
	import 'pdfjs-dist/web/pdf_viewer.css'

	export let url: string | URL; //url of pdf.
	const INTERNAL_URL = url.toString();

	let classname = ''; //allows component to recieve classes
	export { classname as class };

	let styles = ''; //allows component to recieve classes
	export { styles as style };

	export let scale = 1;
	const MIN_SCALE = 0.4;
	const MAX_SCALE = 2.3;

	enum SpreadModes { //init display modes.
		'NONE',
		'ODD',
		'EVEN',
	}
	export let display_mode = '';
	let _spread_mode = SpreadModes.NONE;
	if (display_mode in SpreadModes) {
		_spread_mode = SpreadModes[display_mode as 'NONE' | 'ODD' | 'EVEN'];
	}

	//internal variables.
	let component_container: HTMLDivElement;
	let container: HTMLDivElement;
	let password = '';
	let password_error = false;
	let password_message = '';
	let _prev_gap_top = '8px';
	let _prev_gap_bottom = '8px';

	//Init button handlers (some require hydration on mount)
	let onPasswordSubmit: () => void;
	let onZoomIn: () => void;
	let onZoomOut: () => void;
	let onPageDisplay: () => void;

	const printPdf = (url: string) => {
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);

		iframe.style.display = 'none';
		iframe.onload = function () {
			setTimeout(function () {
				iframe.focus();
				iframe.contentWindow?.print();
			}, 1);
		};

		iframe.src = url;
	};

	const onPageGap = () => {
		const pages = component_container.getElementsByClassName('page');
		if (pages.length === 0) {
			return;
		}
		const current_styles = getComputedStyle(pages[0] as HTMLDivElement);
		const current_gap_bottom = current_styles.marginBottom;
		const current_gap_top = current_styles.marginTop;
		for (const page of pages) {
			(page as HTMLDivElement).style.marginBottom = _prev_gap_bottom;
			(page as HTMLDivElement).style.marginTop = _prev_gap_top;
		}
		_prev_gap_bottom = current_gap_bottom;
		_prev_gap_top = current_gap_top;
	};


	// Pinch to zoom functionality
	let pinchZoom_startX = 0, pinchZoom_startY = 0;
	let pinchZoom_initialPinchDistance = 0;
	let pinchZoom_scale = 1;

	const reset = () => { pinchZoom_startX = pinchZoom_startY = pinchZoom_initialPinchDistance = 0; pinchZoom_scale = 1; };

	function pinchZoomTouchEndHandler (e: TouchEvent) {
		if (pinchZoom_initialPinchDistance <= 0) { return; }
		container.style.transform = `none`;
		container.style.transformOrigin = `unset`;
		mainPDFViewer.currentScale *= Math.max(Math.min(pinchZoom_scale, MAX_SCALE), MIN_SCALE);

		// ----------------------------
		const rect = component_container.getBoundingClientRect();
		const dx = pinchZoom_startX - rect.left;
		const dy = pinchZoom_startY - rect.top;
		container.scrollLeft += dx * (pinchZoom_scale - 1);
		container.scrollTop += dy * (pinchZoom_scale - 1);
		// ----------------------------

		reset();
	}
	function pinchZoomTouchStartHandler (e:TouchEvent) {
		if (e.touches.length > 1) {
			pinchZoom_startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
			pinchZoom_startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
			pinchZoom_initialPinchDistance = Math.hypot((e.touches[1].pageX - e.touches[0].pageX), (e.touches[1].pageY - e.touches[0].pageY));
		} else {
			pinchZoom_initialPinchDistance = 0;
		}
	}
	function pinchZoomTouchMoveHandler (e:TouchEvent) {
		if (pinchZoom_initialPinchDistance <= 0 || e.touches.length < 2) { return; }
		e.preventDefault()
		const pinchDistance = Math.hypot((e.touches[1].pageX - e.touches[0].pageX), (e.touches[1].pageY - e.touches[0].pageY));
		const originX = pinchZoom_startX + component_container.scrollLeft;
		const originY = pinchZoom_startY + component_container.scrollTop;

		const newScale = mainPDFViewer.currentScale * (pinchDistance / pinchZoom_initialPinchDistance)
		if (newScale < MIN_SCALE) pinchZoom_scale = MIN_SCALE / mainPDFViewer.currentScale;
		else if (newScale > MAX_SCALE) pinchZoom_scale = MAX_SCALE / mainPDFViewer.currentScale;
		else {
			pinchZoom_scale = pinchDistance / pinchZoom_initialPinchDistance
		}
		container.style.transform = `scale(${pinchZoom_scale})`;
		container.style.transformOrigin = `${originX}px ${originY}px`;
	}
	function pinchZoomMouseWheelHandler (e:any) {
		if (e.ctrlKey) {
			e.preventDefault()
			mainPDFViewer.currentScale = Math.max(MIN_SCALE, Math.min(mainPDFViewer.currentScale + e.wheelDelta * 0.002, MAX_SCALE))
		}
	}

	let mainPDFViewer:any
	onMount(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

		if (['static', 'initial'].includes(getComputedStyle(component_container).position)) {
			console.warn('PdfViewer sizing only works when it is positioned (not static).');
		}
		const init_promise = import('pdfjs-dist/web/pdf_viewer.js').then((pdfjs_viewer) => {
			const event_bus = new pdfjs_viewer.EventBus();

			// (Optionally) enable hyperlinks within PDF files.
			const pdf_link_service = new pdfjs_viewer.PDFLinkService({
				eventBus: event_bus,
			});

			// (Optionally) enable find controller.
			const pdf_find_controller = new pdfjs_viewer.PDFFindController({
				eventBus: event_bus,
				linkService: pdf_link_service,
			});
			const pdf_viewer = new pdfjs_viewer.PDFViewer({
				container,
				eventBus: event_bus,
				linkService: pdf_link_service,
				findController: pdf_find_controller,
				l10n: pdfjs_viewer.NullL10n,
			});
			mainPDFViewer = pdf_viewer
			
			pdf_link_service.setViewer(pdf_viewer);
			return { pdf_viewer, pdf_link_service };
		});

		const renderDocument = async () => {
			const { pdf_viewer, pdf_link_service } = await init_promise;
			// Loading document.
			const loading_task = pdfjs.getDocument({
				url,
				password,
				isEvalSupported: false,
			});
			loading_task.promise
				.then((pdf_document) => {
					pdf_viewer.setDocument(pdf_document);
					pdf_link_service.setDocument(pdf_document, null);
					pdf_viewer.currentScale = scale;
					pdf_viewer.spreadMode = _spread_mode;
				})
				.catch(function (error) {
					password_error = true;
					password_message = error.message;
				});

			onZoomIn = () => {
				if (scale <= MAX_SCALE) {
					scale = scale + 0.1;
					pdf_viewer.currentScale = scale;
				}
			};
			onZoomOut = () => {
				if (scale >= MIN_SCALE) {
					scale = scale - 0.1;
					pdf_viewer.currentScale = scale;
				}
			};
			onPageDisplay = () => {
				_spread_mode = (_spread_mode + 1) % 3;
				pdf_viewer.spreadMode = _spread_mode;
			};
			return pdf_viewer;
		};
		const render = renderDocument();

		onPasswordSubmit = () => {
			renderDocument();
		};

		return () => {
			render.then((pdf_viewer) => {
				pdf_viewer.cleanup();
			});
		};
	});

	function download(url: string) {
		const a = document.createElement('a');
		if (!a.click) {
			throw new Error('DownloadManager: "a.click()" is not supported.');
		}
		a.href = url;
		a.target = '_parent';
		// Use a.download if available. This increases the likelihood that
		// the file is downloaded instead of opened by another PDF plugin.
		if ('download' in a) {
			a.download = url.substring(url.lastIndexOf('/') + 1);
		}
		// <a> must be in the document for recent Firefox versions,
		// otherwise .click() is ignored.
		(document.body || document.documentElement).append(a);
		a.click();
		a.remove();
	}
</script>

<div class={classname} bind:this={component_container}
	on:touchstart={pinchZoomTouchStartHandler}
	on:touchend={pinchZoomTouchEndHandler}
	on:touchmove={pinchZoomTouchMoveHandler}
	on:wheel={pinchZoomMouseWheelHandler}
	id="viewer-parent">

	{#if password_error === true}
		<div class="spdfinner passwordError">
			<p>This document requires a password to open:</p>
			<p>{password_message}</p>
			<div>
				<input type="password" bind:value={password} />
				<button on:click={onPasswordSubmit} class="password-button"> Submit </button>
			</div>
		</div>
	{:else}
		<div class="spdfbanner">
			<span class="toolbarbutton" on:click={onZoomIn} on:keydown={onZoomIn}>
				<img title="Zoom In" src={zoominsvg} alt="zoom in" class="spdfbutton" />
			</span>
			<span class="toolbarbutton" on:click={onZoomOut} on:keydown={onZoomOut}>
				<img title="Zoom Out" src={zoomoutsvg} alt="zoom out" class="spdfbutton" />
			</span>
			<span class="toolbarbutton" on:click={onPageGap} on:keydown={onPageGap}>
				<img title="Toggle Page Display" src={gapsvg} alt="toggle page gap" class="spdfbutton" />
			</span>
			<span class="toolbarbutton" on:click={onPageDisplay} on:keydown={onPageDisplay}>
				<img
					title="Toggle Page Display"
					src={spreadsvg}
					alt="toggle page display"
					class="spdfbutton"
				/>
			</span>
			<span class="toolbarbutton" on:click={() => printPdf(INTERNAL_URL)} on:keydown={() => printPdf(INTERNAL_URL)}>
				<img title="Print" src={printsvg} alt="print" class="spdfbutton" />
			</span>
			<span class="toolbarbutton" on:click={() => download(INTERNAL_URL)} on:keydown={() => download(INTERNAL_URL)}>
				<img title="Download" src={downloadsvg} alt="download" class="spdfbutton" />
			</span>
		</div>

		<div class="spdfinner" style={styles}>
			<div class="viewerContainer" style="background-color: var(--color-bg-2);" bind:this={container}>
				<div id="viewer" class="pdfViewer" />
			</div>
		</div>
	{/if}
</div>

<style>
	.viewerContainer {
		overflow: auto;
		position: absolute;
		top: 32px;
		right: 0;
		bottom: 0;
		left: 0;
		outline: none;
		width: 100%;

		--selection-color: var(--feature-color);
	}
	.spdfbanner {
		position: absolute;
		z-index: 10;
		top: 0px;
		height: 2.75rem;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
		background-color: var(--color-bg);
		box-shadow: 1rem;
	}
	.spdfbutton {
		width: 25px;
		vertical-align: middle;
	}
	.spdfinner {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	.passwordError {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border: 1px solid var(--color-shadow);
		background-color: var(--color-bg);
	}
	.toolbarbutton:hover {
		background-color: var(--feature-color-hover);
	}
	.toolbarbutton {
		border-radius: 2px;
		padding: 4px;
		touch-action: manipulation;
		cursor: pointer;
	}


	/* Selection */
	:global(.textLayer ::-moz-selection) {
		background: var(--selection-color);
	}

	:global(.textLayer ::selection) {
		background: var(--selection-color);
	}
</style>
