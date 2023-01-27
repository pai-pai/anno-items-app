import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// import '@fortawesome/fontawesome-free/css/all.css'
// import '@mdi/font/css/materialdesignicons.css' 
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { createVuetify } from 'vuetify'
// import { aliases, fa } from 'vuetify/iconsets/fa'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases, md } from 'vuetify/iconsets/md'


export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
          md,
        }
    },
})