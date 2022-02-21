<template>
  <div style="width: 100%;  padding: 16px">
    <div style="display: flex;">
      <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">Back</v-btn>
      <header style="justify-self: center; margin-left: auto; margin-right: auto; padding-top: 32px">Parametrize your
        {{ type }}{{ mode }}
        validation.
      </header>
      <v-btn color="primary" @click="checkEvent" style="margin-left: auto; margin-right: 0; justify-self: flex-end">
        Validate
      </v-btn>
    </div>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Targets</v-subheader>
      </div>
      <v-alert v-if="errorTargetID" type="error" dense>Missing Target ID Type selection</v-alert>
      <v-alert v-if="errorTargetIDs" type="error" dense>Missing TargetIDs</v-alert>
      <div style="display: flex; width: 100%">
        <div>
          <v-select label="Target ID Type" :items="targetIDTypes[type]" v-model="targetIDType"
                    style="max-width: 170px" outlined dense filled></v-select>
          <v-file-input label="Upload Targets" hint="Upload a file of newline separated target IDs" dense
                        style="width: 210px; max-width: 210px; cursor: pointer"
                        v-model="targetFile" @change="readTargetFile" prepend-icon="" filled outlined
                        prepend-inner-icon="$file"></v-file-input>
        </div>
        <v-textarea label="Target IDs" v-model="targets"
                    style="max-width: 40vw; margin-left: auto; margin-right: auto; justify-self: flex-end" no-resize
                    filled
                    placeholder="Enter your chosen IDs newline separated..."></v-textarea>
      </div>
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>References (Optional)</v-subheader>
      </div>
      <div style="display: flex;">
        <v-checkbox v-model="useReference" label="Use Reference"></v-checkbox>
        <v-checkbox v-model="useSingleReference" :disabled="!useReference" label="Use single ID"
                    style="margin-left: 16px"></v-checkbox>
      </div>
      <v-alert v-if="errorReferenceID" type="error" dense>Missing Reference ID Type selection</v-alert>
      <v-alert v-if="errorReferenceIDs" type="error" dense>Missing Reference IDs</v-alert>
      <div style="display: flex; width: 100%">
        <div>
          <v-select outlined :disabled="!useReference" filled label="Reference ID Type" :items="targetIDTypes[type]"
                    v-model="referenceIDType" style="max-width: 170px" dense></v-select>
          <v-file-input :disabled="!useReference || useSingleReference" label="Upload References"
                        hint="Upload a file of newline separated referende IDs" dense
                        style="width: 210px; max-width: 210px; cursor: pointer"
                        v-model="referenceFile" @change="readReferenceFile" prepend-icon="" filled outlined
                        prepend-inner-icon="$file"></v-file-input>
        </div>
        <v-text-field label="Reference ID" :disabled="!useReference" v-if="useSingleReference"
                      style="margin-left: auto; margin-right: auto; justify-self: flex-end;max-width: 40vw; "
                      v-model="reference" filled></v-text-field>
        <v-textarea :disabled="!useReference" v-else label="Reference IDs" filled
                    placeholder="Enter your chosen IDs newline separated..." v-model="references" no-resize
                    style="max-width: 40vw; margin-left: auto; margin-right: auto; justify-self: flex-end;"></v-textarea>
      </div>
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Additional Parameters (Optional)</v-subheader>
      </div>
      <div style="display: flex;margin-bottom: 75px">
        <v-checkbox style="margin-right: 64px; margin-top: 4px;" :disabled="!useReference" v-model="enriched"
                    label="Enriched"></v-checkbox>
        <v-select label="Distance Measure" :items="distanceMeasures" v-model="distanceModel"
                  style="max-width: 170px; margin-right: 32px" outlined dense filled></v-select>
        <v-slider label="Runs" min="100" max="10000" step="100" v-model="runs" dense>
          <template v-slot:prepend>
            <v-text-field v-model="runs" single-line type="number"
                          style="max-width: 5rem; margin-top: -16px"></v-text-field>
          </template>
        </v-slider>
      </div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "Configuration",

  props: {
    mode: String,
    type: String,
  },

  data() {
    return {
      targetFile: undefined,
      referenceFile: undefined,
      errorTargetID: false,
      errorTargetIDs: false,
      errorReferenceID: false,
      errorReferenceIDs: false,
      targetIDType: undefined,
      targets: "",
      references: "",
      reference: "",
      referenceIDType: undefined,
      useReference: false,
      useSingleReference: true,
      enriched: false,
      runs: 1000,
      distanceModel: "jaccard",
      distanceMeasures: [
        {text: "Jaccard Index", value: "jaccard"},
        {text: "Overlap coefficient", value: "overlap"}
      ],
      targetIDTypes: {
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

  methods: {

    idsToList: function (ids) {
      return ids.split(/\n/)
    },

    readTargetFile: function (file) {
      this.readFile(file, 'target')
    },

    readReferenceFile: function (file) {
      this.readFile(file, 'reference')
    },

    readFile: function (file, goal) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result;
        result = atob(result.split('base64,')[1])
        if (goal === 'target') {
          this.targets = result
          this.targetFile = undefined
        }
        if (goal === 'reference') {
          this.references = result
          this.referenceFile = undefined
        }
      });

      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progress: ${Math.round(percent)}`);
        }
      });
      reader.readAsDataURL(file);
    },


    checkEvent: function () {
      this.errorTargetID = !this.targetIDType;
      this.errorTargetIDs = this.targets.length === 0
      if (this.useReference) {
        this.errorReferenceID = !this.referenceIDType;
        this.errorReferenceIDs = this.useSingleReference ? this.reference.length === 0 : this.references.length === 0
      } else {
        this.errorReferenceIDs = false
        this.errorReferenceID = false
      }
      let error = this.errorTargetID || this.errorTargetIDs || this.errorReferenceID || this.errorReferenceIDs
      if (!error) {
        let route;
        let params = {
          type: this.type,
          targetID: this.targetIDType,
          target: this.idsToList(this.targets),
          distance: this.distanceModel,
          runs: this.runs,
        }
        if (this.useReference) {
          params.enriched = this.enriched
          params.referenceID = this.referenceIDType
          params.reference = this.useSingleReference ? this.reference : this.idsToList(this.references)
          route = this.useSingleReference ? "id-set" : "set-set"
        } else {
          route = "set"
        }
        params.mode = route
        this.$emit("validationEvent", params)
      }
    }
  }

}
</script>

<style scoped>

</style>