<template>
  <div style="width: 100%;  padding: 16px">
    <v-sheet style="margin-top: 16px;">
      <div style="display: flex; justify-content: center" v-if="!error && result ===undefined">
        <v-subheader>Status: {{
            status ? status + (status === "Queued" ? "(" + queueStats.queuePosition + "/" + queueStats.queueLength + ")" : '') : "communicating..."
          }}
        </v-subheader>
      </div>
      <div v-if="result===undefined">
        <v-progress-linear :color="error?'error':'primary'" :indeterminate="progress===undefined" :value="progress"></v-progress-linear>
        <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
          <i v-if="taskID && !result">You may return to your results later using the following URL: <a
              :href="getCurrentURL()">{{ getCurrentURL() }}</a></i>
        </div>
      </div>
      <div v-else style="padding-left: 64px; padding-right: 64px">
        <v-tabs v-model="resultTab" centered>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>
            Input
          </v-tab>
          <v-tab>
            Result
          </v-tab>

        </v-tabs>
        <v-divider></v-divider>
        <v-tabs-items v-model="resultTab">
          <v-tab-item>
            <div style="display:flex;">
              <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Data
              </v-subheader>
              <v-tooltip top>
                <template v-slot:activator="{attrs, on}">
                  <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                         style="justify-self: flex-end; margin-left: auto; margin-right: 0">
                    <v-icon>fas fa-download</v-icon>
                  </v-btn>
                </template>
                <div>Download all files as .zip</div>
              </v-tooltip>
            </div>
            <div v-if="input" style="margin-top: 32px; margin-bottom: 32px">
              <div style="display: flex">
                <div style="width:50%; justify-content: center; display: flex">
                  <div v-if="mode==='cluster'">
                    <div style=" margin:16px">
                      <b>Clusterings</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.target_id }}</th>
                            <th>cluster</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tar in input.target" :key="'cluster'+tar.id">
                            <td style="margin:4px">{{ tar.id }}</td>
                            <td style="margin:4px">{{ tar.cluster }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </div>
                  <div v-else style="display: flex">
                    <div style=" margin:16px">
                      <b>Targets</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.target_id[0].toUpperCase()+input.target_id.substring(1) }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tar in input.target" :key="'set'+tar">
                            <td style="margin:4px">{{ tar }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                    <div style=" margin:16px; margin-left:64px" v-if="input.reference_id">
                      <b>Reference{{ typeof input.reference === 'string' ? '' : 's' }}</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: scroll;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.reference_id }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <template v-if="typeof input.reference !== 'string'">
                            <tr v-for="ref in input.reference" :key="'ref'+ref">
                              <td style="margin:4px">{{ ref }}</td>
                            </tr>
                          </template>
                          <template v-else>
                            <tr>
                              <td style="margin:4px">{{ input.reference }}</td>
                            </tr>
                          </template>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </div>
                </div>
                <div style="display: flex; justify-content: center;">
                  <div style="display: flex; align-self: center; margin-top: auto; margin-bottom: auto;">
                    <div>
                      <b>Configuration</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="param in Object.keys(input).filter(k=>!k.includes('target') && !k.includes('reference'))"
                              :key="'conf-'+param">
                            <td style="margin: 4px">{{ param }}</td>
                            <td style="margin:4px">{{ input[param] }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </div>
                </div>
              </div>
              <div style="display: flex; justify-content: center; margin-top: 16px;">
                <v-btn @click="downloadInput()">
                  <v-icon left>fas fa-download</v-icon>
                  Download Input
                </v-btn>
              </div>
            </div>
            <!--            <v-divider></v-divider>-->
            <!--            <div style="display:flex; justify-content: center">-->
            <!--              <v-subheader>Absolute Input Scores</v-subheader>-->
            <!--            </div>-->
            <!--            <div style="display: flex;">-->
            <!--            </div>-->
          </v-tab-item>
          <v-tab-item>
            <div style="display:flex">
              <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Tabular results
              </v-subheader>
              <v-tooltip top>
                <template v-slot:activator="{attrs, on}">
                  <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                         style="justify-self: flex-end; margin-left: auto; margin-right: 0">
                    <v-icon>fas fa-download</v-icon>
                  </v-btn>
                </template>
                <div>Download all files as .zip</div>
              </v-tooltip>
            </div>
            <div style="display: flex">
              <div
                  style="width: 50%; align-self: center; margin-top: auto; margin-bottom: auto; padding-top:16px; padding-bottom: 16px;">
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
                            <th class="text-left" v-for="head in Object.keys(result.p_values.values)" :key="'p_value-head'+head">
                              <div style="white-space: nowrap">
                                {{head}}
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
                            <td  v-for="head in Object.keys(result.p_values.values)" :key="'p_value-'+head" style="margin:4px">{{ formatValue(result.p_values.values[head][metric]) }}</td>
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
                                <v-btn small plain v-if="csvs" dense @click="downloadFile(getCSV('p-value_validation'))"
                                       style="margin:4px">
                                  <v-icon right>fas fa-download</v-icon>
                                </v-btn>
                              </th>
                              <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                                  :key="'p_'+head">
                                <div style="white-space: nowrap; cursor: pointer" @click="clusterMeasure=head">
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
                              </b></td>
                              <td style="margin:4px" v-for="head in Object.keys(result.p_values.values)"
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
                  style="width: 50%; align-self: center; margin-top: auto; margin-bottom: auto; padding-top:16px; padding-bottom: 16px;">
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
                            <th class="text-left" v-for="head in Object.keys(result.input_values.values)" :key="'input_'+head">
                              <div style="white-space: nowrap">
                                {{head}}
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
                          <tr  v-for="metric in Object.keys(Object.values(result.input_values.values)[0])" :key="metric">
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
                            <td  v-for="head in Object.keys(result.input_values.values)" :key="'input_value-'+head" style="margin:4px">{{ formatValue(result.input_values.values[head][metric]) }}</td>
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
                                <div style="white-space: nowrap; cursor: pointer" @click="clusterMeasure=head">
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
                                <!--                                <div style="white-space: nowrap">-->
                                <!--                                  {{ head }}-->
                                <!--                                  <v-tooltip right>-->
                                <!--                                    <template v-slot:activator="{attrs, on}">-->
                                <!--                                      <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>-->
                                <!--                                    </template>-->
                                <!--                                    <div style="width:200px; text-align: justify">{{ tooltips[head] }}</div>-->
                                <!--                                  </v-tooltip>-->
                                <!--                                </div>-->
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])"
                                :key="metric">
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
                              </b></td>
                              <td style="margin:4px" v-for="head in Object.keys(result.input_values.values)"
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
              <div style="display: flex; justify-content: center" v-if="mode!=='cluster'">
                <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                  <v-img :src="getPlot('p-value')" height="35vh" contain
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0" @click="downloadFile(getPlot('p-value'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>

                  </v-img>
                  <!--                  <p style="text-align: justify">-->
                  <!--                    Lorem Ipsum has been the-->
                  <!--                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type-->
                  <!--                    and-->
                  <!--                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the-->
                  <!--                    leap</p>-->
                </div>
                <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                  <v-img :src="getPlot('mappability')" height="35vh" contain
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0" @click="downloadFile('mappability')">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <!--                  <p style="text-align: justify"> Lorem Ipsum has been the-->
                  <!--                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type-->
                  <!--                    and-->
                  <!--                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the-->
                  <!--                    leap</p>-->
                </div>
              </div>
              <div v-else style="display: flex">
                <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                  <!--                  <div style="width: 100%; display: flex; justify-content: center">-->
                  <!--                    <v-select dense outlined filled v-model="clusterMeasure"-->
                  <!--                              :items="[{text:'DI',value:'di'},{text:'SS',value:'ss'},{text:'DBI',value:'dbi'}]"-->
                  <!--                              style="max-width: 100px;"></v-select>-->
                  <!--                  </div>-->
                  <div style="display: flex; margin-top:32px;">
                    <v-tabs vertical>
                      <v-tab @click="clusterMeasure='DI-based'">
                        DI-based
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['DI-based'] }}</div>
                        </v-tooltip>
                      </v-tab>
                      <v-tab @click="clusterMeasure='SS-based'">
                        SS-based
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['SS-based'] }}</div>
                        </v-tooltip>
                      </v-tab>
                      <v-tab @click="clusterMeasure='DBI-based'">
                        DBI-based
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['DBI-based'] }}</div>
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
                  <!--                  <p style="text-align: justify"> Lorem Ipsum has been the-->
                  <!--                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type-->
                  <!--                    and-->
                  <!--                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the-->
                  <!--                    leap</p>-->
                </div>
                <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                  <v-img :src="getPlot('mappability')" height="35vh" contain
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('mappability'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <!--                  <p style="text-align: justify"> Lorem Ipsum has been the-->
                  <!--                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type-->
                  <!--                    and-->
                  <!--                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the-->
                  <!--                    leap</p>-->
                </div>
              </div>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </div>
      <span v-if="error"><i>An error with following message occurred: {{ status }}</i></span>
    </v-sheet>
  </div>
</template>

<script>

export default {
  name: "Results",


  props: {
    params: Object,
    idMap: Object,
  },
  data() {
    return {
      result: undefined,
      error: false,
      taskID: undefined,
      status: "",
      resultTab: 1,
      queueStats: undefined,
      mode: undefined,
      type: undefined,
      plots: undefined,
      csvs: undefined,
      zips: undefined,
      progress: undefined,
      input: undefined,
      clusterMeasure: 'DI-based',
      tooltips: {
        'DI-based': "Dunn Index: ratio of the cluster with the lowest density compared to the two clusters that are closest to each other.",
        'SS-based': "Silhouette Score: measures how well an observation is clustered and it estimates the average distance between clusters.",
        'DBI-based': "Davies Bouldin Index: measures how dense clusters are iin comparison to distances between each cluster pair.",
        p_values: "Empirical P-value calculated on input score(s) with respect to chosen background model.",
        set_value: "Calculated input score based on functional or genetic coherence.",
        'GO.BP': "based on functional coherence of biological process annotations from Gene Ontology (GO).",
        'go.CC': "based on functional coherence of cell component annotations from Gene Ontology (GO).",
        'go.MF': "based on functional coherence of molecular function annotations process from Gene Ontology (GO).",
        'KEGG': "based on functional coherence of pathways annotations from Kyoto Encyclopedia of Genes and Genomes (KEGG)",
        'JI-based':"TODO",
        'OC-based':'TODO'
      }
    }
  },

  created() {
    this.taskID = this.$route.query.id

    if (this.taskID) {
      this.queryStatus()
    } else {
      this.execute()
    }
  },

  methods: {
    saveResult: function (result) {
      console.log(result)
      if (typeof result !== "object") {
        this.error = true
        return;
      }
      this.result = result.result
      this.loadPlots()
    },
    getFilePath: function (name) {
      return this.$config.HOST_URL + "/result_file?name=" + name
    },

    downloadFile: function (name) {
      window.open(name)
    },

    loadPlots: function () {
      this.$http.getResultFiles(this.taskID).then(files => {
        this.plots = files.filter(file => file.type === 'png').map(file => this.getFilePath(file.name))
        this.csvs = files.filter(file => file.type === 'csv').map(file => this.getFilePath(file.name))
        this.zips = files.filter(file => file.type === 'zip').map(file => this.getFilePath(file.name))
      }).catch(console.error)
    },

    getIDType: function (id) {
      for (let idType of Object.keys(this.idMap)) {
        if (this.idMap[idType].includes(id))
          return idType
      }
      return undefined
    },
    downloadInput: function () {
      this.download('digest_' + this.taskID + "_input.json", JSON.stringify(this.input))
    },
    download: function (name, content) {
      let dl = document.createElement('a')
      dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      dl.setAttribute('download', name)
      dl.style.direction = 'none'
      document.body.appendChild(dl)
      dl.click()
      document.body.removeChild(dl)
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

    getCurrentURL: function () {
      return window.location
    },

    queryResult: function () {
      this.$http.getTaskResult(this.taskID).then(this.saveResult).catch(console.error)
    },

    queryStatus: function () {
      this.$http.getTaskStatus(this.taskID).then((response) => {
        console.log(response)
        if (!this.input)
          this.input = response.input
        if (!this.mode)
          this.mode = response.mode
        if (!this.type)
          this.type = response.type
        this.queueStats = response.stats
        if (response.status)
          this.status = response.status
        if(response.progress)
          this.progress=response.progress*100
        if (response.failed)
          this.error = true
        if (response.done) {
          this.queryResult()
        }
        return response.failed || response.done
      }).then((done) => {
        if (!done)
          setTimeout(() => this.queryStatus(), 5000)
      }).catch(console.error)
    },

    formatValue: function (value) {
      if (typeof value === "number") {
        let s = value + ""
        let idx = s.indexOf(".")
        return s.length > 8 ? s.substring(0, Math.max(8, idx)) : s
      }
      return value
    },

    saveTaskId: function (response) {
      this.taskID = response.task
      this.$router.push("/result?id=" + this.taskID)
      this.queryStatus()
    },
    reset: function () {
      this.$router.push("/")
      this.$router.go()
    },

    getCSV: function (name) {
      return this.csvs.filter(csv => csv.includes(name))[0]
    },

    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    },

    getPlot: function (name) {
      return this.plots.filter(plot => plot.includes(name))[0]
    },

    execute: function () {
      this.step = 2
      switch (this.params.mode) {
        case "set": {
          this.$http.validate_set(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.type).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break;
        }
        case "id-set": {
          this.$http.validate_id_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background, this.params.type).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "set-set": {
          this.$http.validate_set_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background, this.params.type).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "cluster": {
          this.$http.validate_cluster(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background, this.params.type).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
        }
      }
    }

  }

}
</script>

<style scoped lang="sass">

.v-subheader
  font-size: 1.5rem
  margin-top: 8px

</style>