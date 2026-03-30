<template>
  <v-card :style="{width:'100%', margin: mobile ? '' : '8px', 'margin-bottom':'0', height: '100%', padding: mobile ? '4px' : '0'}">
    <v-card-title :style="{'font-size' : mobile ? '1.2rem' : '1.5rem', 'padding-bottom': '0'}">{{title}}</v-card-title>
    <v-card-subtitle :style="{height: '52px', 'font-size' :mobile ? '1rem' :'', 'padding-top': '4px'}">{{text}}
    </v-card-subtitle>
    <v-divider v-if="mobile"></v-divider>
    <slot name="default">
    </slot>
  </v-card>
</template>

<script>
export default {
  name: "TypeCard",
  props: {
    title: String,
    text: String,
    width:{
      type:String,
      default:"45%"
    },
    mobile: {
      type: Boolean,
      default: false,
    }
  },
  created() {
  },
}
</script>

<style scoped>

</style>