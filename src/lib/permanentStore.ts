import { writable, get, type Updater } from 'svelte/store'

export function storable<T>(key:string, data:T|undefined = undefined) {
   const store = writable(data)
   const { subscribe, set } = store
   const isBrowser = typeof window !== 'undefined'

   if (isBrowser && localStorage.getItem(key)) {
      set(JSON.parse(localStorage.getItem(key) || ''))
   }

   return {
      subscribe,
      set: (n:T) => {
         isBrowser && (localStorage.setItem(key, JSON.stringify(n)))
         set(n)
      },
      update: (cb:Updater<T>) => {
         const updatedStore = cb(get(store))

         isBrowser && (localStorage.setItem(key, JSON.stringify(updatedStore)))
         set(updatedStore)
      }
   }
}