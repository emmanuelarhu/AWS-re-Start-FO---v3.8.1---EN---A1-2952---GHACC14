   function vocLocalStorageRemove(key) {
      if (typeof(Storage) === "undefined") {
          return false;
      }
      localStorage.removeItem(key);
      return true;
   }
   function vocLocalStorageKey(type, id) {
       switch (type) {
           case "editasn":
               key = "editasn_" + id;
               return key;
           default:
               alert("Invalid key. Ignoring. Report to support");
               return null;
        }           
   }
