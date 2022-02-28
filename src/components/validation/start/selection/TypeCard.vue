<template>
  <v-card :style="{width: mobile? '100%' : '45%', margin: mobile ? '' : '8px', 'margin-bottom':'32px', height: '100%',padding: mobile ? '4px' :''}">
    <v-card-title :style="{'font-size' : mobile ? '1.2rem' : '', 'margin-bottom' : mobile ? '8px' :''}">{{title}}</v-card-title>
    <v-card-subtitle :style="{height: '52px', 'font-size' :mobile ? '1rem' :''}">{{text}}
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