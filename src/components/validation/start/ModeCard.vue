<template>
  <v-card style="width: 50%; height: 100%; position:relative;" :elevation="hover ? 10:0"
          :flat="!hover"
          @mouseenter="hover=true" @mouseleave="hover=false">
    <div>
      <v-img
          class="white--text align-end"
          style="margin:8px 15% 48px; position: relative"
          width="70%"
          :src="image"
      >
      </v-img>
    </div>
    <div v-show="!hover" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex">
      <div style="align-self: flex-end; justify-self: center; margin: auto auto 0;">
        <v-card-title style="color:#484848"><i>{{title}}</i></v-card-title>
      </div>
    </div>
    <div v-show="hover"
         style="position: absolute;  display:flex; background-color: rgba(255,255,255,0.6); width: 100%; height: 100%; top: 0; left: 0">
      <div style="align-self: center; margin-top: auto; margin-bottom: auto; ">
        <v-card-title style="color:#484848">{{title}}</v-card-title>
        <v-card-subtitle v-show="hover" :style="{'font-size': isMobile() ? '0.8rem' :'1rem','line-height': isMobile() ? '0.8rem' :'1rem'}">{{text}}
        </v-card-subtitle>
        <v-card-actions v-show="hover">
          <div style="width: 100%; display: flex; justify-content: center">
            <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:type,mode:mode})">
              Validate
            </v-btn>
          </div>
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ModeCard",


  props:{
    title:String,
    text:String,
    image:String,
    type: String,
    mode: String,
  },
  data(){
    return{
      hover:false,
    }
  },
  methods:{
      isMobile: function(){
        return navigator.userAgentData.mobile
      },
  }
}
</script>

<style scoped>

</style>