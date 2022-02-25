<template>
  <div>
    <div style="background-color: cornflowerblue; width: 100%; padding:16px">
      <h2 style="display: flex; justify-content: center; color: white; font-size: 5rem">Digest</h2>
    </div>
    <div
        style="width: 90%;text-align: justify; display: flex; justify-self: center; margin: 32px auto 16px;color: #484848">
      <template v-if="step===0">
        <div style="display: flex">
          <div>
            DIGEST allows the user to in silico validate a set or clustering of<br>genes as well as diseases and compute an empirical P-value.<br><br>

            <ul>
            <h4>Supported validation annotations</h4>
                <li>functional enrichment or coherence<br>based on Gene Ontology (GO) and KEGG pathways</li>
                <li>genetic coherence obtained from DisGeNET<br>based on shared variants and shared genes</li>
            </ul> <br>
            <h4>Statistical analysis</h4>
            Computation of empirical P-values using background models.<br><br>
            <i>All results displayed as tables and visualized as plots are downloadable.</i>
          </div>
          <div style="width: 45%; margin-left: 16px;">
            <v-img :src="getIllustration()" max-width="30vw" />
          </div>
        </div>

      </template>
      <template v-if="step===1">
        <template v-if="params.mode==='cluster'">
          <ul>
            <h4>Clusterings can be validated reference-free based on three different clustering quality measures. </h4><br>
                <li><b>Dunn Index</b>: calculates the ratio of the cluster with the lowest density compared to the two clusters that are closest to each other.</li>
                <li><b>Silhouette Score</b>: Calculates the average of the ratio of each element's distance to another cluster and its own density to the maximum of the two values.</li>
                <li><b>Davies Bouldin Index</b>: calculates for all clusters in pairs how strong the density of the elements in their own cluster is compared to the distance between the two clusters.</li>
          </ul>
        </template>
        <template v-else>
          <ul>
            <h4>Sets can be validated reference-free, against a reference set or a single id. </h4><br>
                <li><b>set reference-free</b>: Assesses whether the internal functional or genetic coherence of the genes contained is statistically significant.</li>
                <li><b>set against set</b>: Assesses whether the functional or genetic similarity of each element in the target set separately is statistically significant to the reference.
                For this purpose, all annotations or only the enriched ones of the reference can be used.</li>
                <li><b>set against id</b>: If both the set and the id are both diseases or genes, the assessment is equal to the set-set.<br>Comparing a gene set against a disease id it
                assesses whether the functional relevance is statistically significant</li>
          </ul>

        </template>
      </template>
      <template v-if="step===2">
        <ul>
          <h4>The result page is divided:</h4><br>
          <li><b>Under Input</b>: shows the input as well as the selected parameters and additionally gives the sole functional or genetic score(s) for the input.</li>
          <li><b>Under Result</b>: shows the statistical significance of the input score with respect to a background model using empirical P-values.<br>
            Additionally provides a visual representation of the results. <i>The complete results can be downloaded directly.</i></li>
        </ul>
      </template>
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