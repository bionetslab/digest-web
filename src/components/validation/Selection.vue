<template>
  <v-container style="padding-bottom: 32px">
    <v-row justify="center">
      <v-col cols="10" md="6">
        <TypeCard title="Set" text="Validate gene or disease sets w.r.t. functional or genetic coherence." :mobile="isMobile()">
          <template v-slot:default>
            <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
              <ModeCard :image="getCardImage('set','gene', false)" :fallback_image="getCardImage('set', 'gene', true)" type="gene" mode="set"
                        text="Validate gene sets w.r.t. functional coherence." title="Gene" :mobile="mobile"
                        @startValidationEvent="validationEvent" style="padding-top:1.22%; padding-bottom: 1.22%"></ModeCard>
              <v-divider v-if="isMobile()" vertical style="z-index: 99"></v-divider>
              <ModeCard :image="getCardImage('set','disease', false)"  :fallback_image="getCardImage('set', 'disease', true)" type="disease" mode="set"
                        style="padding-top:1.2%; padding-bottom: 1.2%"
                        text="Validate disease sets w.r.t. genetic coherence." title="Disease"
                        @startValidationEvent="validationEvent" :mobile="mobile"></ModeCard>
            </div>
          </template>
        </TypeCard>
      </v-col>
      <v-col cols="10" md="6">
        <TypeCard title="Clustering" text="Validate gene or disease clusterings w.r.t. functional or genetic
        coherence." :mobile="isMobile()">
          <template v-slot:default>
            <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
              <ModeCard :image="getCardImage('cluster','gene', false)" :fallback_image="getCardImage('cluster','gene',true)" type="gene" mode="cluster"
                        text="Validate gene clustering w.r.t. functional coherence." title="Gene"
                        @startValidationEvent="validationEvent" :mobile="mobile"></ModeCard>
              <v-divider v-if="isMobile()" vertical style="z-index: 99"></v-divider>
              <ModeCard :image="getCardImage('cluster','disease', false)" :fallback_image="getCardImage('cluster','disease',true)" type="disease" mode="cluster"
                        text="Validate disease clustering w.r.t. genetic coherence." title="Disease"
                        @startValidationEvent="validationEvent" :mobile="mobile"></ModeCard>
            </div>
          </template>
        </TypeCard>
      </v-col>
      <v-col cols="10" md="6">
        <TypeCard title="Subnetwork" text="Validate subnetworks induced by a gene or disease set w.r.t. functional or genetic
        coherence." :mobile="isMobile()">
          <template v-slot:default>
            <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
              <ModeCard :image="getCardImage('network','gene', false)" :fallback_image="getCardImage('network','gene',true)" type="gene" mode="network"
                        text="Validate subnetworks induced by a gene set w.r.t. functional coherence." title="Gene"
                        @startValidationEvent="validationEvent" :mobile="mobile"></ModeCard>
              <v-divider v-if="isMobile()" vertical style="z-index: 99"></v-divider>
              <ModeCard :image="getCardImage('network','disease', false)" :fallback_image="getCardImage('network','disease',true)"  type="disease" mode="network"
                        text="Validate subnetworks induced by a disease set w.r.t. genetic coherence." title="Disease"
                        @startValidationEvent="validationEvent" :mobile="mobile"></ModeCard>
            </div>
          </template>
        </TypeCard>
      </v-col>
    </v-row>
  </v-container>



</template>

<script>
import ModeCard from "@/components/validation/start/selection/ModeCard";
import TypeCard from "@/components/validation/start/selection/TypeCard";

export default {
  name: "Selection",
  components: {TypeCard, ModeCard},
  props:{
    mobile:{
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    hover_set_gene: false,
    hover_set_disorder: false,
    hover_cluster_gene: false,
    hover_cluster_disorder: false,
  }),


  created() {
    if (this.$route.fullPath !== "/")
      this.$router.push("/")
  },

  methods: {
    isMobile: function () {
      return this.mobile
    },
    getCardImage: function (mode, type, fallback) {
      return this.$config.STATIC_PATH + "assets/" + mode + "_" + type + (fallback ? ".png":".avif")
    },
    validationEvent: function (data) {
      this.$emit("startValidationEvent", data)
    }
  }
}
</script>

<style scoped>

</style>