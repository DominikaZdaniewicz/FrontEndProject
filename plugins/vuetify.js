import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import { en, pl } from "vuetify/locale";
import VueApexCharts from 'vue3-apexcharts';

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
    nuxtApp.vueApp.use(VueApexCharts)
    nuxtApp.vueApp.use(vuetify)
    return {
        provide: {
            attachmentsApi: {
                saveFile: async (formData, type) => {
                    return await $fetch(`/api/ImportData/internal/${selectedType.value}`, {
                        method: 'POST',
                        body: formData
                    })
                }
            }
        }
    }

})


