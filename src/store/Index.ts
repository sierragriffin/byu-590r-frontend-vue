import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { cities } from "./cities.module";
import { capitals } from "./capitals.module";
import { attractions } from "./attractions.module";

const store = createStore({
   modules: {
       auth,
       user,
       cities,
       capitals, 
       attractions
   }
});

export default store;