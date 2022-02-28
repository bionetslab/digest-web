<template>
  <v-card :style="{width: '50%', padding: isMobile() ? '4px' :'', height: '100%', position:'relative'}" :elevation="hover ? 10:0"
          :flat="!hover"
          @mouseenter="hover=true" @mouseleave="hover=false">
    <div>
      <v-card-title v-if="mobile" style="font-size: 1.25rem; margin-bottom: 8px">
        {{title}}
      </v-card-title>
      <v-card-subtitle v-if="mobile" style="color: #00000099; font-size: 0.8rem">{{text}}</v-card-subtitle>
      <v-img
          class="white--text align-end"
          :style="{margin: isMobile()? '4px 15% 8px' : '8px 15% 48px', position: 'relative'}"
          width="70%"
          :src="image"
      >
      </v-img>
    </div>
    <div v-if="!mobile" v-show="!hover" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex">
      <div style="align-self: flex-end; justify-self: center; margin: auto auto 0;">
        <v-card-title style="color:#484848"><i>{{title}}</i></v-card-title>
      </div>
    </div>
    <div v-if="!mobile" v-show="hover"
         style="position: absolute;  display:flex; background-color: rgba(255,255,255,0.6); width: 100%; height: 100%; top: 0; left: 0">
      <div style="align-self: center; margin-top: auto; margin-bottom: auto; ">
        <v-card-title style="color:#484848; margin-bottom: 16px">{{title}}</v-card-title>
        <v-card-subtitle style="font-size: 1rem; line-height: 1rem; margin-bottom: 16px}">{{text}}
        </v-card-subtitle>
        <v-card-actions>
          <div style="width: 100%; display: flex; justify-content: center">
            <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:type,mode:mode})">
              Validate
            </v-btn>
          </div>
        </v-card-actions>
      </div>
    </div>
    <div v-if="mobile" style="display: flex; justify-content: center; margin-bottom: 8px">
      <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:type,mode:mode})" rounded style="font-size: smaller">
        <v-icon left style="margin-right:4px ">fas fa-play</v-icon>
        Validate
      </v-btn>
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
    mobile:{
      type: Boolean,
      default: false,
    }
  },
  data(){
    return{
      hover:false,
    }
  },

  methods:{
      isMobile: function(){
       return this.mobile
      },
  }
}
</script>

<style scoped>

</style>