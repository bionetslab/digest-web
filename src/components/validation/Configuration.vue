<template>
  <div style="width: 100%;  padding: 16px">
    <div style="display: flex;">
      <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">
        <v-icon left>fas fa-angle-left</v-icon>
        Back
      </v-btn>
      <header style="justify-self: center; margin-left: auto; margin-right: auto; padding-top: 32px">Parametrize your
        <i>{{ type }}-{{ mode }}</i>
        validation.
      </header>
      <v-btn color="primary" @click="checkEvent" style="margin-left: auto; margin-right: 0; justify-self: flex-end">
        Validate
        <v-icon right>fas fa-angle-right</v-icon>
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
          <v-file-input ref="tarInput" label="Upload Targets" hint="Upload a file of newline separated target IDs" dense
                        style="width: 210px; max-width: 210px; cursor: pointer"
                        v-model="targetFile" @change="readTargetFile" prepend-icon="" filled outlined
                        prepend-inner-icon="fas fa-arrow-up-from-bracket"></v-file-input>
        </div>
        <v-textarea v-if="mode==='set'" label="Target IDs" v-model="targets"
                    style="max-width: 40vw; margin-left: auto; margin-right: auto; justify-self: flex-end" no-resize
                    filled
                    placeholder="Enter your chosen IDs newline separated..."></v-textarea>
        <v-data-table v-if="mode==='cluster'" item-key="id" :items="clusters"
                      style="max-width: 40vw; margin-left: auto; margin-right: auto; justify-self: flex-end" dense
                      :headers="clusterHeaders">
          <template v-slot:item.action="{item}">
            <v-btn icon @click="removeClusterEntry(item)" small>
              <v-icon>far fa-trash-can</v-icon>
            </v-btn>
          </template>
          <template v-slot:body.append="{headers}">
            <tr>
              <td :style="{'text-align':headers[0].align}">
                <v-text-field dense label="id" style="margin-bottom: -16px; margin-top:16px;padding-bottom: 6px"
                              v-model="clusterIDModel"></v-text-field>
              </td>
              <td :style="{'text-align':headers[1].align}">
                <v-text-field dense label="cluster" style="margin-bottom: -16px; margin-top:16px; padding-bottom: 6px"
                              v-model="clusterModel"></v-text-field>
              </td>
              <td :style="{'text-align':headers[2].align, 'width':headers[2].width}">
                <v-btn icon @click="addClusterEntry()" small>
                  <v-icon>far fa-square-plus</v-icon>
                </v-btn>

              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <v-divider></v-divider>
      <template v-if="mode==='set'">
        <div style="display: flex; justify-content: center">
          <v-subheader>References (Optional)</v-subheader>
        </div>
        <div style="display: flex; width: 100%">
          <v-checkbox v-model="useReference" label="Use Reference"
                      style="justify-self: flex-start; margin-right: auto"></v-checkbox>
          <div style="justify-self: center; margin-left: auto; margin-right: auto; display: flex;width: 40vw">
            <v-checkbox v-model="useSingleReference" @click="useMultiReference=!useSingleReference"
                        :disabled="!useReference" label="Use single ID"
                        style="margin-left: 16px"></v-checkbox>
            <v-checkbox v-model="useMultiReference" @click="useSingleReference=!useMultiReference"
                        :disabled="!useReference" label="Use multiple IDs"
                        style="margin-left: 16px"></v-checkbox>
          </div>

        </div>
        <v-alert v-if="errorReferenceID" type="error" dense>Missing Reference ID Type selection</v-alert>
        <v-alert v-if="errorReferenceIDs" type="error" dense>Missing Reference IDs</v-alert>
        <div style="display: flex; width: 100%">
          <div>
            <v-select v-if="type==='gene'" outlined :disabled="!useReference" filled label="Reference Type"
                      :items="refTypes" v-model="refType"
                      style="max-width: 180px" dense></v-select>
            <v-select v-else outlined :disabled="!useReference" filled label="Reference Type"
                      :items="[{text:'Disease',value:'disease'}]" v-model="refType"
                      style="max-width: 180px" dense></v-select>
            <v-select outlined :disabled="!useReference" filled label="Reference ID Type"
                      :items="targetIDTypes[refType]"
                      v-model="referenceIDType" style="max-width: 180px" dense></v-select>
            <v-file-input ref="refInput" :disabled="!useReference || useSingleReference" label="Upload References"
                          hint="Upload a file of newline separated reference IDs" dense
                          style="width: 210px; max-width: 210px; cursor: pointer"
                          v-model="referenceFile" @change="readReferenceFile" prepend-icon="" filled outlined
                          prepend-inner-icon="fas fa-arrow-up-from-bracket"></v-file-input>
          </div>
          <v-text-field label="Reference ID" :disabled="!useReference" v-if="useSingleReference"
                        style="margin-left: auto; margin-right: auto; justify-self: flex-end;max-width: 40vw; "
                        v-model="reference" filled></v-text-field>
          <v-textarea :disabled="!useReference" v-else label="Reference IDs" filled
                      placeholder="Enter your chosen IDs newline separated..." v-model="references" no-resize
                      style="max-width: 40vw; margin-left: auto; margin-right: auto; justify-self: flex-end;"></v-textarea>
        </div>
        <v-divider></v-divider>
      </template>
      <div style="display: flex; justify-content: center">
        <v-subheader>Additional Parameters (Optional)</v-subheader>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 16px">
        <v-checkbox v-if="mode==='set'" style="margin-right: 64px; margin-top: 4px;" :disabled="!useReference"
                    v-model="enriched"
                    label="Enriched"></v-checkbox>
        <v-select label="Distance Measure" :items="distanceMeasures" v-model="distanceModel"
                  style="max-width: 200px; margin-right: 32px" outlined dense filled></v-select>
        <v-select label="Background model" :items="backgroundModels" v-model="backgroundModel"
                  style="max-width: 200px; margin-right: 32px" outlined dense filled></v-select>
      </div>
      <div style="display: flex;justify-content: center; margin-bottom: 32px; margin-top: 16px">
        <v-slider label="Runs" min="100" max="10000" step="100" v-model="runs" dense>
          <template v-slot:prepend>
            <v-text-field v-model="runs" single-line type="number"
                          style="max-width: 5rem; margin-top: -16px"></v-text-field>
          </template>
        </v-slider>
        <div style="width: 32px"></div>
        <v-slider label="Replace" min="1" max="100" step="1" v-model="replace" dense>
          <template v-slot:prepend>
            <v-text-field v-model="replace" single-line type="number"
                          style="max-width: 5rem; margin-top: -16px"></v-text-field>
          </template>
        </v-slider>
      </div>
    </v-sheet>
    <v-snackbar v-model="notification.show" :multi-line="true" :timeout="notification.timeout"
                color="warning" dark>
      {{ notification.message }}
    </v-snackbar>
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
      notification: {
        show: false,
        message: "",
        timeout: 5000,
      },
      targetFile: undefined,
      referenceFile: undefined,
      errorTargetID: false,
      errorTargetIDs: false,
      errorReferenceID: false, width: "50px",
      errorReferenceIDs: false,
      clusterIDModel: "",
      clusterModel: "",
      targetIDType: undefined,
      targets: "",
      references: "",
      reference: "",
      referenceIDType: undefined,
      useReference: false,
      useSingleReference: true,
      useMultiReference: false,
      enriched: false,
      runs: 1000,
      replace:100,
      distanceModel: "jaccard",
      refType: "disease",
      clusterHeaders: [
        {text: 'Target ID', align: 'start', sortable: true, value: 'id'},
        {text: 'Cluster', align: 'start', sortable: true, value: 'cluster'},
        {text: 'Action', align: 'end', sortable: false, width: "50px", value: 'action'}
      ],
      clusters: [],
      refTypes: [
        {text: "Gene", value: "gene"},
        {text: "Disease", value: "disease"},
      ],
      distanceMeasures: [
        {text: "Jaccard Index", value: "jaccard"},
        {text: "Overlap coefficient", value: "overlap"}
      ],
      backgroundModel: "complete",
      backgroundModels: [
        {text: "Complete", value: "complete"},
        {text: "Term Preserving", value: "term-preserving"}
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
      if (file) {
        this.readFile(file, 'target')
        this.$refs.tarInput.blur()
      }
    },

    readReferenceFile: function (file) {
      if (file) {
        this.readFile(file, 'reference')
        this.$refs.refInput.blur()
      }
    },

    limitColumns: function (content, delim, columns) {
      return content.split("\n").map(line => {
        if(line.length===0)
          return ""
        let entries = line.split(delim);
        let l = ""
        for (let e = 0; e < columns; e++)
          l += entries[e] + delim;
        l = l.substring(0, l.length - delim.length)
        return  l
      }).filter(l=>l.length>0).join("\n")
    },

    readFile: function (file, goal) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result;
        result = atob(result.split('base64,')[1])
        if (goal === 'target') {
          if (this.mode === 'cluster') {
            result = this.limitColumns(result, "\t", 2)
            result.split("\n").forEach(l => {
              let entries = l.split("\t");
              this.addToClusters(entries[0], entries[1]);
            })
          } else {
            result = this.limitColumns(result, "\t", 1)
            this.targets = result
          }
          this.targetFile = undefined
        }
        if (goal === 'reference') {
          this.references = result
          this.referenceFile = undefined
        }
      });
      reader.readAsDataURL(file);
    },

    removeClusterEntry: function (item) {
      this.clusters.splice(this.clusters.indexOf(item), 1)
    },
    addClusterEntry: function () {
      if (this.clusterModel && this.clusterIDModel && this.clusterModel.length > 0 && this.clusterIDModel.length > 0) {
        this.addToClusters(this.clusterIDModel, this.clusterModel)
        this.clusterModel = ""
        this.clusterIDModel = ""
      }
    },


    addToClusters: function (id, cluster) {
      let clusterItem = {id: id, cluster: cluster}
      if (this.clusters.indexOf(clusterItem) > -1) {
        this.setNotification("This entry already exists!")
      } else {
        if (this.clusters.map(i => i.id).indexOf(id) > -1) {
          this.setNotification("Duplicate IDs are not allowed!")
        } else
          this.clusters.push(clusterItem)
      }
    },

    setNotification: function (message, timeout) {
      if (timeout)
        this.notification.timeout = timeout
      if (message)
        this.notification.message = message
      this.notification.show = true
    },

    checkEvent: function () {
      this.errorTargetID = !this.targetIDType;
      this.errorTargetIDs = this.mode === 'cluster' ? this.clusters.length === 0 : this.targets.length === 0
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
          target: this.mode === 'cluster' ? this.clusters : this.idsToList(this.targets),
          distance: this.distanceModel,
          runs: this.runs,
          replace: this.replace,
          background: this.backgroundModel,
        }
        if (this.useReference) {
          params.enriched = this.enriched
          params.referenceID = this.referenceIDType
          params.reference = this.useSingleReference ? this.reference : this.idsToList(this.references)
          route = this.useSingleReference ? "id-set" : "set-set"
        } else {
          route = this.mode === 'cluster' ? 'cluster' : "set"
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