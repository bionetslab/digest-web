<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <v-card style="width: 45%; margin:8px; margin-bottom:32px; height: 100%">
      <v-card-title>Set</v-card-title>
      <v-card-subtitle style="height: 52px">Validate gene or disease sets w.r.t. functional or genetic coherence.
      </v-card-subtitle>
      <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
        <ModeCard :image="getCardImage('set','gene')" type="gene" mode="set"
                  text="Validate gene sets w.r.t. functional coherence." title="Gene"
                  @startValidationEvent="validationEvent" style="padding-top:1.22%; padding-bottom: 1.22%"></ModeCard>
        <ModeCard :image="getCardImage('set','disease')" type="disease" mode="set"  style="padding-top:1.2%; padding-bottom: 1.2%"
                  text="Validate disease sets w.r.t. genetic coherence." title="Disease" @startValidationEvent="validationEvent"></ModeCard>
      </div>
    </v-card>
    <v-card style="width: 45%; margin:8px; margin-bottom:32px">
      <v-card-title>Clustering
      </v-card-title>
      <v-card-subtitle style="height: 52px">Validate gene or disease clusterings w.r.t. functional or genetic
        coherence.
      </v-card-subtitle>
      <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
        <ModeCard :image="getCardImage('cluster','gene')" type="gene" mode="cluster"
                  text="Validate gene clustering w.r.t. functional coherence." title="Gene"
                  @startValidationEvent="validationEvent"></ModeCard>
        <ModeCard :image="getCardImage('cluster','disease')" type="disease" mode="cluster"
                  text="Validate disease clustering w.r.t. genetic coherence." title="Disease" @startValidationEvent="validationEvent"></ModeCard>
      </div>
    </v-card>
  </div>
</template>

<script>
import ModeCard from "@/components/validation/start/ModeCard";

export default {
  name: "Selection",
  components: {ModeCard},
  data: () => ({
    hover_set_gene: false,
    hover_set_disorder: false,
    hover_cluster_gene: false,
    hover_cluster_disorder: false
  }),


  created() {
  },

  methods: {
    getCardImage: function (mode, type) {
      return this.$config.STATIC_PATH + "assets/" + mode + "_" + type + ".png"
    },
    validationEvent: function (data) {
      this.$emit("startValidationEvent", data)
    }
  }
}
</script>

<style scoped>

</style>