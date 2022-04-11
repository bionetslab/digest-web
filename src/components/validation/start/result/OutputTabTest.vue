<template>
  <div>
    <div style="display:flex">
      <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Tabular results
      </v-subheader>
      <v-tooltip top>
        <template v-slot:activator="{attrs, on}">
          <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                 style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 12px">
            <v-icon>fas fa-download</v-icon>
          </v-btn>
        </template>
        <div>Download all files as .zip</div>
      </v-tooltip>
    </div>
    <v-container>
      <v-row justify="center" style="padding-top:16px; padding-bottom: 16px">
        <v-col cols="12" lg="6" style="display: flex; justify-content: center">
          <div>
            <b>Empirical P-values</b>
            <v-simple-table>
              <template v-slot:default v-if="mode!=='cluster'">
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('p-value_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                      :key="'p_value-head'+head">
                    <div style="white-space: nowrap">
                      {{ head }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
                  <td style="margin:4px">
                    <b style="color: rgba(0,0,0,0.6)">
                      <div style="white-space: nowrap">
                        {{ metric }}
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                        </v-tooltip>
                      </div>
                    </b>
                  <td v-for="head in Object.keys(result.p_values.values)" :key="'p_value-'+head"
                      style="margin:4px">{{ formatValue(result.p_values.values[head][metric]) }}
                  </td>
                </tr>
                </tbody>
              </template>
              <template v-slot:default v-if="mode==='cluster'">
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('p-value_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                      :key="'p_'+head">
                    <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                         @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.p_values.values).indexOf(head)">
                      <span v-show="head !== clusterMeasure">{{ head }}</span>
                      <b style="color: cornflowerblue; text-decoration: underline"
                         v-show="head===clusterMeasure">{{
                          head
                        }}</b>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right :style="{'color': clusterMeasure===head? 'cornflowerblue':''}" small
                                  v-bind="attrs" v-on="on">far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
                  <td :style="{margin: mobile ? '1px':'4px'}" @click="distributionMeasure=metric">
                    <b style="color: rgba(0,0,0,0.6); cursor: pointer" >
                    <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                      <b v-show="metric===distributionMeasure" style="color: cornflowerblue; text-decoration: underline">{{metric}}</b>
                      <span v-show="metric !== distributionMeasure">{{ metric }}</span>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right small v-bind="attrs" v-on="on" :color="metric===distributionMeasure? 'primary': ''">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                      </v-tooltip>
                    </div>
                  </b></td>
                  <td :style="{margin: mobile ? '1px':'4px'}"
                      v-for="head in Object.keys(result.p_values.values)"
                      :key="metric+head" style="cursor: pointer" @click="distributionMeasure=metric; clusterMeasure=head;clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head) ">
                    <b v-show="head===clusterMeasure || metric===distributionMeasure" :style="{'color':'cornflowerblue','text-decoration': (head===clusterMeasure && metric===distributionMeasure) ? 'underline':'none'}">{{
                        formatValue(result.p_values.values[head][metric])
                      }}</b>
                    <span v-show="head !== clusterMeasure && metric!==distributionMeasure">{{
                        formatValue(result.p_values.values[head][metric])
                      }}</span>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
        <v-col cols="12" lg="6" style="display: flex; justify-content: center">
          <div>
            <b>{{ getScoreName() }}</b>
            <v-simple-table style="max-width:500px">
              <template v-slot:default v-if="mode!=='cluster'">
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('input_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.input_values.values)"
                      :key="'input_'+head">
                    <div style="white-space: nowrap">
                      {{ head }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])" :key="metric">
                  <td style="margin:4px"><b style="color: rgba(0,0,0,0.6)">
                    <div style="white-space: nowrap">
                      {{ metric }}
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                      </v-tooltip>
                    </div>
                  </b>
                  <td v-for="head in Object.keys(result.input_values.values)" :key="'input_value-'+head"
                      style="margin:4px">{{ formatValue(result.input_values.values[head][metric]) }}
                  </td>
                </tr>
                </tbody>
              </template>
              <template v-slot:default v-if="mode==='cluster'">
                <thead>
                <tr>
                  <th>
                    <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('input_validation'))"
                           style="margin:4px">
                      <v-icon right>fas fa-download</v-icon>
                    </v-btn>
                  </th>
                  <th class="text-left" v-for="head in Object.keys(result.input_values.values)"
                      :key="'p_'+head">
                    <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                         @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
                      <span v-show="head !== clusterMeasure">{{ head }}</span>
                      <b style="color: cornflowerblue; text-decoration: underline"
                         v-show="head===clusterMeasure">{{
                          head
                        }}</b>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right :style="{'color': clusterMeasure===head? 'cornflowerblue':''}" small
                                  v-bind="attrs" v-on="on">far fa-question-circle
                          </v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>
                      </v-tooltip>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])"
                    :key="metric">
                  <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6); cursor: pointer" @click="distributionMeasure=metric">
                    <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                      <b v-show="metric===distributionMeasure" style="color: cornflowerblue; text-decoration: underline">{{metric}}</b>
                      <span v-show="metric !== distributionMeasure">{{ metric }}</span>
                      <v-tooltip right>
                        <template v-slot:activator="{attrs, on}">
                          <v-icon right small v-bind="attrs" v-on="on" :color="metric===distributionMeasure? 'primary': ''">far fa-question-circle</v-icon>
                        </template>
                        <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                      </v-tooltip>
                    </div>
                  </b></td>
                  <td :style="{margin: mobile ? '1px':'4px'}"
                      v-for="head in Object.keys(result.input_values.values)"
                      :key="metric+head" style="cursor: pointer" @click="distributionMeasure=metric; clusterMeasure=head;clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
                    <b v-show="head===clusterMeasure || metric===distributionMeasure" :style="{'color':'cornflowerblue','text-decoration': (head===clusterMeasure && metric===distributionMeasure) ? 'underline':'none'}">{{
                        formatValue(result.input_values.values[head][metric])
                      }}</b>
                    <span v-show="head !== clusterMeasure && metric!==distributionMeasure">{{
                        formatValue(result.input_values.values[head][metric])
                      }}</span>
                    <!--                                {{ formatValue(result.input_values.values[head][metric]) }}-->
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <template v-if="plots">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Annotation selection</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top:16px; padding-bottom: 16px">
          <v-col cols="7" md="3" v-if="mode==='cluster'" style="display: flex; justify-content: center">
            <v-select label="Scoring type" style="max-width: 200px" dense outlined filled :items="measureMap['clustering']" v-model="clusterMeasure" @change="printValue(clusterMeasureIdx)"></v-select>
          </v-col>
          <v-col cols="7" md="3" style="display: flex; justify-content: center">
            <v-select label="Annotation type"  style="max-width: 200px" dense outlined filled :items="termMap[mode]" v-model="distributionMeasure"></v-select>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Significance figures</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
          <v-col cols="12" sm="5">
            <v-img :src="getPlot('p-value')" contain style="position: relative; width: 80%" v-if="mode!=='cluster'">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('p-value'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
            <v-img :src="getPlot(clusterMeasure+'_p-value')" contain v-if="mode==='cluster'" style="position: relative; " width="80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" sm="5">
            <v-img :src="getPlot(getDistPlotName())" contain
                   style="position: relative" width="80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getDistPlotName())">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>

      </v-container>
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Mappability figures</v-subheader>
      </div>
      <v-container>
        <v-row justify="center" style="padding-top: 16px; padding-bottom: 16px">
          <v-col cols="12" sm="6">
            <v-img :src="getPlot('mappability')" contain style="margin:16px; position: relative" width="80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('mappability'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" sm="6">
            <v-img :src="getPlot(getAnnotationPlotName())" contain style="margin:16px; position: relative" width="80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getAnnotationPlotName())">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
          <v-col cols="12" sm="6">
            <v-img :src="getPlot(getSankeyPlotName())" contain style="margin:16px; position: relative" width="80%">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getSankeyPlotName())">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
export default {
  name: "OutputTabTest",
  props: {
    mode: String,
    type: String,
    csvs: Array,
    plots: Array,
    result: Object,
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tooltips: {
        'DI-based': "Dunn Index: ratio of the cluster with the lowest density compared to the two clusters that are closest to each other.",
        'SS-based': "Silhouette Score: measures how well an observation is clustered and it estimates the average distance between clusters.",
        'DBI-based': "Davies Bouldin Index: measures how dense clusters are iin comparison to distances between each cluster pair.",
        p_values: "Empirical P-value calculated on input score(s) with respect to chosen background model.",
        set_value: "Calculated input score based on functional or genetic coherence.",
        'GO.BP': "based on functional coherence of biological process annotations from Gene Ontology (GO).",
        'GO.CC': "based on functional coherence of cell component annotations from Gene Ontology (GO).",
        'GO.MF': "based on functional coherence of molecular function annotations process from Gene Ontology (GO).",
        'KEGG': "based on functional coherence of pathways annotations from Kyoto Encyclopedia of Genes and Genomes (KEGG)",
        'JI-based': "Jaccard Index based: calculated by the intersection of two sets divided by the union of both.",
        'OC-based': "Overlap Coefficient based: calculated by the intersection of two sets divided by the size of the smaller set."
      },
      clusterMeasure: 'DI-based',
      clusterMeasureIdx: 0,
      distributionMeasure:'',
      measureMap: {
        'clustering': ['DI-based', 'SS-based', 'DBI-based'],
      },
      termMap: {
        'cluster': ['GO.BP', 'GO.CC', 'GO.MF', 'KEGG'],
        'set': ['KEGG', 'JI-based', 'OC-based']
      },
    }
  },

  created() {
    this.distributionMeasure = this.termMap[this.mode][0]
  },

  methods: {
    downloadFile: function (file) {
      this.$emit('downloadEvent', file)
    }
    ,
    printValue: function (value){
      console.log(value)
    },
    getCSV: function (name) {
      return this.csvs.filter(csv => csv.includes(name))[0]
    }
    ,

    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    }
    ,

    getPlot: function (name) {
      let url = this.plots.filter(plot => plot.includes(name))[0]
      if (url)
        return url
      return "https://www.schulz-grafik.de/wp-content/uploads/2018/03/placeholder.png"
    },

    getScoreName: function () {
      if (this.mode === 'set-set') {
        let ref_type = this.getIDType(this.input.reference_id)
        if (this.type === 'gene' || ref_type === 'gene') {
          return 'Functional relevance score'
        }
        return 'Functional relevance score & genetic relevance score'
      } else {
        return this.type === 'gene' ? 'Functional relevance score' : 'Genetic relevance score'
      }
    },

    getSankeyPlotName: function () {
      return this.distributionMeasure + "_sankey"
    },

    getAnnotationPlotName: function(){
        return this.distributionMeasure + "_annotation_distribution"
    },
    getDistPlotName: function () {
      if (this.mode === "cluster")
        return this.clusterMeasure + "_" + this.distributionMeasure + "_distribution"
      return this.distributionMeasure + "_distribution"
    },

    formatValue: function (value) {
      if (typeof value === "number") {
        let s = value + ""
        let idx = s.indexOf(".")
        let decimals = this.mobile ? 4 : 6;
        return s.length > (decimals + 2) ? s.substring(0, Math.max(decimals + 2, idx)) : s
      }
      return value
    },

  }
}
</script>

<style scoped lang="sass">

.v-subheader
  font-size: 1.5rem
  margin-top: 8px

.sh_mobile
  font-size: 1.2rem

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.margin_mobile
  padding-left: 8px
  padding-right: 8px

</style>