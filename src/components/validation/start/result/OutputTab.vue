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
    <div :style="{display: isMobile() ? '':'flex'}">
      <div
          :style="{width: isMobile()?'100%':'50%', 'align-self': 'center', 'margin-top': 'auto', 'margin-bottom': 'auto', 'padding-top':'16px', 'padding-bottom': '16px'}">
        <div style=" justify-content: center; display: flex">
          <div>
            <b>Empirical P-values</b>
            <div v-if="mode!=='cluster'" style="display: flex">
              <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
                <template v-slot:default>
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
              </v-simple-table>
            </div>
            <div v-else>
              <div>
                <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
                  <template v-slot:default>
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
                    <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
                      <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6)">
                        <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                          {{ metric }}
                          <v-tooltip right>
                            <template v-slot:activator="{attrs, on}">
                              <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                            </template>
                            <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                          </v-tooltip>
                        </div>
                      </b></td>
                      <td :style="{margin: mobile ? '1px':'4px', padding: mobile ? '0 1px' :''}"
                          v-for="head in Object.keys(result.p_values.values)"
                          :key="metric+head">
                        <b style="color: cornflowerblue; " v-show="head===clusterMeasure">{{
                            formatValue(result.p_values.values[head][metric])
                          }}</b>
                        <span v-show="head !== clusterMeasure">{{
                            formatValue(result.p_values.values[head][metric])
                          }}</span>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
          :style="{width: isMobile()? '100%' :'50%', 'align-self': 'center', 'margin-top': 'auto', 'margin-bottom': 'auto', 'padding-top':'16px', 'padding-bottom': '16px'}">
        <div style=" justify-content: center; display: flex">
          <div>
            <b>{{ getScoreName() }}</b>
            <div v-if="mode!=='cluster'" style="display: flex">
              <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
                <template v-slot:default>
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
              </v-simple-table>
            </div>
            <div v-else>
              <div style="display: flex">
                <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
                  <template v-slot:default>
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
                      <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6)">
                        <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                          {{ metric }}
                          <v-tooltip right>
                            <template v-slot:activator="{attrs, on}">
                              <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                            </template>
                            <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                          </v-tooltip>
                        </div>
                      </b></td>
                      <td :style="{margin: mobile ? '1px':'4px', padding: mobile ? '0 1px' :''}"
                          v-for="head in Object.keys(result.input_values.values)"
                          :key="metric+head">
                        <b style="color: cornflowerblue; " v-show="head===clusterMeasure">{{
                            formatValue(result.input_values.values[head][metric])
                          }}</b>
                        <span v-show="head !== clusterMeasure">{{
                            formatValue(result.input_values.values[head][metric])
                          }}</span>
                        <!--                                {{ formatValue(result.input_values.values[head][metric]) }}-->
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-divider></v-divider>
    <div style="display: flex; justify-content: center">
      <v-subheader>Summary figures</v-subheader>
    </div>
    <template v-if="plots">
      <div v-if="isMobile()">
        <template v-if="mode!=='cluster'">
          <v-container>
            <v-col>
              <v-row justify="center">
                <!--                        <div style="width: 100%; display: flex; justify-content: center">-->
                <v-img :src="getPlot('p-value')" contain
                       style="position: relative">
                  <v-btn icon small style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('p-value'))">
                    <v-icon small>fas fa-download</v-icon>
                  </v-btn>
                </v-img>
                <!--                      </div>-->
              </v-row>
              <v-row>
                <!--                        <div style="width: 100%; display: flex; justify-content: center">-->
                <v-img :src="getPlot('mappability')" contain
                       style="position: relative">
                  <v-btn icon small style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('mappability'))">
                    <v-icon small>fas fa-download</v-icon>
                  </v-btn>
                </v-img>
                <!--                        </div>-->
              </v-row>
            </v-col>
          </v-container>
        </template>
        <template v-else>
          <v-container>
            <v-col>
              <v-row justify="center">
                <v-container>
                  <v-col>
                    <v-row>
                      <v-tabs vertical v-model="clusterMeasureIdx">
                        <v-tab v-for="measure in measureMap['clustering']" @click="clusterMeasure=measure;"
                               :key="measure+'_p-value_plots'">
                          {{ measure }}
                          <v-tooltip right>
                            <template v-slot:activator="{attrs, on}">
                              <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                            </template>
                            <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                          </v-tooltip>
                        </v-tab>
                      </v-tabs>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row>
                      <v-img :src="getPlot(clusterMeasure+'_p-value')" contain
                             style="position: relative">
                        <v-btn icon small style="position: absolute; right: 0"
                               @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                          <v-icon small>fas fa-download</v-icon>
                        </v-btn>
                      </v-img>
                    </v-row>
                  </v-col>
                </v-container>
              </v-row>
              <v-row justify="center">
                <v-img :src="getPlot('mappability')" contain
                       style="margin:32px; position: relative">
                  <v-btn icon small style="position: absolute; right: 0"
                         @click="downloadFile(getPlot('mappability'))">
                    <v-icon small>fas fa-download</v-icon>
                  </v-btn>
                </v-img>
              </v-row>
            </v-col>
          </v-container>
        </template>
      </div>
      <div v-else>
        <div style="display: flex; justify-content: center" v-if="mode!=='cluster'">
          <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
            <v-img :src="getPlot('p-value')" height="35vh" contain
                   style="margin:32px; position: relative">
              <v-btn icon small style="position: absolute; right: 0" @click="downloadFile(getPlot('p-value'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </div>
          <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
            <v-img :src="getPlot('mappability')" height="35vh" contain
                   style="margin:32px; position: relative">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('mappability'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </div>
        </div>
        <div v-else style="display: flex">
          <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
            <div style="display: flex; margin-top:32px;">
              <v-tabs vertical v-model="clusterMeasureIdx">
                <v-tab v-for="measure in measureMap['clustering']" @click="clusterMeasure=measure;"
                       :key="measure+'_p-value_plots'">
                  {{ measure }}
                  <v-tooltip right>
                    <template v-slot:activator="{attrs, on}">
                      <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                  </v-tooltip>
                </v-tab>
              </v-tabs>
              <v-img :src="getPlot(clusterMeasure+'_p-value')" height="35vh" contain
                     style="margin-left:32px; margin-bottom:32px; position: relative">
                <v-btn icon small style="position: absolute; right: 0"
                       @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                  <v-icon small>fas fa-download</v-icon>
                </v-btn>
              </v-img>
            </div>
          </div>
          <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
            <v-img :src="getPlot('mappability')" height="35vh" contain
                   style="margin:32px; position: relative">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getPlot('mappability'))">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center">
        <v-subheader>Extended summary figures</v-subheader>
      </div>
      <div id="plots2" style="display: flex; justify-content: center">
        <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
          <div style="display: flex; margin-top:32px;">
            <v-tabs vertical>
              <v-tab v-for="measure in termMap[mode]" @click="distributionMeasure=measure;"
                     :key="measure+'_distribution_plots'">
                {{ measure }}
                <v-tooltip right>
                  <template v-slot:activator="{attrs, on}">
                    <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                  </template>
                  <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                </v-tooltip>
              </v-tab>
            </v-tabs>
            <v-img :src="getPlot(getDistPlotName())" height="35vh" contain
                   style="margin-left:32px; margin-bottom:32px; position: relative">
              <v-btn icon small style="position: absolute; right: 0"
                     @click="downloadFile(getDistPlotName())">
                <v-icon small>fas fa-download</v-icon>
              </v-btn>
            </v-img>
          </div>
        </div>
        <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
          <v-img :src="getPlot(getSankeyPlotName())" height="35vh" contain
                 style="margin:32px; position: relative">
            <v-btn icon small style="position: absolute; right: 0"
                   @click="downloadFile(getPlot(getSankeyPlotName()))">
              <v-icon small>fas fa-download</v-icon>
            </v-btn>
          </v-img>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "OutputTab",
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
      measureMap: {
        'clustering': ['DI-based', 'SS-based', 'DBI-based'],
      },
      termMap: {
        'cluster': ['GO.BP', 'GO.CC', 'GO.MF', 'KEGG'],
        'set': ['KEGG', 'JI-based', 'OC-based']
      },
      distributionMeasure: "",
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
    }
    ,
    isMobile: function () {
      return this.mobile
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
      if (this.mode === "cluster")
        return this.clusterMeasure + "-" + this.distributionMeasure + "_distribution"
      return this.distributionMeasure + "_distribution"
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
        let decimals = this.isMobile() ? 4 : 6;
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