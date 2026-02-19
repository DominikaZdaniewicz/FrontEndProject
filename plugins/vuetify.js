import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import { en, pl } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        locale: {
            locale: "en",
            fallback: "pl",
            messages: { en, pl },
        },
        theme: {
            defaultTheme: 'dark', 
        },
        components,
        directives
    })
    nuxtApp.vueApp.use(vuetify)
})

