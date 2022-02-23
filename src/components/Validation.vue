<template>
  <div>
    <div style="background-color: cornflowerblue; width: 100%; padding:16px">
      <h2 style="display: flex; justify-content: center; color: white; font-size: 5rem">Digest</h2>
    </div>
    <div style="margin-top: 16px; margin-bottom: 16px; width: 90%;text-align: justify; display: flex; justify-self: center; margin-right: auto; margin-left: auto; color: #484848">
      <template v-if="step===0">
        1. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
        it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
        including versions of Lorem Ipsum.
      </template>
      <template v-if="step===1">
        2. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
        it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
        including versions of Lorem Ipsum.
      </template>
      <template v-if="step===2">
        3. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled
        it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
        including versions of Lorem Ipsum.
      </template>
    </div>
    <div style="display: flex; justify-content: center" v-if="step===0">
      <v-img :src="getIllustration()" max-width="30vw"></v-img>
    </div>
    <v-divider></v-divider>
    <Selection v-if="step===0" @startValidationEvent="startValidation"></Selection>
    <Configuration v-else-if="step===1" @resetEvent="resetValidation" :mode="params.mode" :type="params.type"
                   @validationEvent="validate"></Configuration>
    <Results v-else-if="step===2" @resetEvent="resetValidation" :params="params"></Results>
  </div>
</template>

<script>

import Selection from "@/components/validation/Selection";
import Configuration from "@/components/validation/Configuration";
import Results from "@/components/validation/Results";

export default {


  name: "Validation",

  data() {
    return {
      digestDescription: "",
      step: 0,
      params: {
        mode: undefined,
        type: undefined,
      },
      result: undefined,
    }
  },

  created() {
    if (this.$route.query.id)
      this.step = 2
  },

  methods: {
    getIllustration: function () {
      return this.$config.STATIC_PATH + "assets/digest_summary_illustration.png"
    },
    startValidation: function (data) {
      this.params.mode = data.mode;
      this.params.type = data.type;
      this.step = 1
    },
    resetValidation: function () {
      this.step = 0
      this.result = undefined;
      this.params = {mode: undefined, type: undefined}
    },
    validate: function (data) {
      this.params = data;
      this.step = 2
    }
  },

  components: {
    Results,
    Configuration,
    Selection,
  }

}
</script>

<style scoped>

</style>