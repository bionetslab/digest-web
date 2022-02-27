<template>
  <div>
    <v-card style="background-color: #d4e6f5; width: 100%; padding:32px; display: flex;">
      <div style="width:32%; justify-content: flex-start">
        <v-img :src="getLogoPath()" width="100%"></v-img>
      </div>
      <div style="width: 60%; justify-content: flex-end; margin-left: auto; margin-right: 0">
        <div style=" height: 100%;display:flex;">
          <p style="font-size: 1.3rem; color: #1c388a; align-self: flex-end; margin-top: auto; margin-bottom: 0">In silico validation of sets and clusterings of genes or diseases.</p>
        </div>
      </div>
      <!--      <h2 style="display: flex; justify-content: flex-start; color: white; font-size: 5rem">DIGEST</h2>-->

    </v-card>
    <div
        style="width: 90%;text-align: justify; display: flex; justify-self: center; margin: 32px auto 16px;color: #484848">
      <template v-if="step===0">
        <div style="display: flex; justify-content: center; width: 100%">
          <v-img :src="getIllustration()" max-width="70%"/>
        </div>
      </template>
    </div>
    <div v-if="step===0">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader style="font-size: 1.5rem">Start validating
          now!
        </v-subheader>
      </div>
    </div>
    <Selection v-if="step===0" @startValidationEvent="startValidation"></Selection>
    <Configuration v-else-if="step===1" @resetEvent="resetValidation" :mode="params.mode" :type="params.type"
                   :id-map="idMap"
                   @validationEvent="validate"></Configuration>
    <Results v-else-if="step===2" @resetEvent="resetValidation" :params="params" :id-map="idMap"></Results>
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
      idMap: {
        "gene": [
          {text: "Entrez ID", value: "entrez"},
          {text: "Ensembl ID", value: "ensembl"},
          {text: "Symbol", value: "symbol"},
          {text: "UniProt ID", value: "uniprot"}]
        ,
        "disease": [
          {text: "MONDO", value: "mondo"},
          {text: "OMIM", value: "omim"},
          {text: "SNOMED", value: "snomedct"},
          {text: "UMLS", value: "umls"},
          {text: "Orphanet", value: "orpha"},
          {text: "MeSH", value: "mesh"},
          {text: "DOID", value: "doid"},
          {text: "ICD-10", value: "ICD-10"},
        ]
      }
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

    getLogoPath: function () {
      return this.$config.STATIC_PATH + "assets/digest_logo.png"
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