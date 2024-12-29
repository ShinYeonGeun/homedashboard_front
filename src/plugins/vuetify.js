import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi"; // Material Design Icons

export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  defaults: {
    global: {
      ripple: false,
    },
    VSheet: {
      elevation: 4,
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  },
})