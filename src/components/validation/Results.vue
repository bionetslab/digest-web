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
        <v-progress-linear :color="error?'error':'primary'" indeterminate></v-progress-linear>
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
            <div style="display:flex; justify-content: center">
              <v-subheader>Data</v-subheader>
            </div>
            <div v-if="input" style="margin-top: 32px; margin-bottom: 32px">
              <div style="display: flex">
                <div style="width:50%; justify-content: center; display: flex">
                  <div v-if="mode==='cluster'">
                    <div style=" margin:16px">
                      <b>Clusters</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.target_id }}</th>
                            <th>cluster</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tar in input.target" :key="tar">
                            <td style="margin:4px">{{ tar.id }}</td>
                            <td style="margin:4px">{{ tar.cluster }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </div>
                  <div v-else>
                    <div style=" margin:16px">
                      <b>Targets</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.target_id }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tar in input.target" :key="tar">
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
                            <tr v-for="ref in input.reference" :key="ref">
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
                              :key="param">
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
            </div>
            <v-divider></v-divider>
            <div style="display:flex; justify-content: center">
              <v-subheader>Absolute Input Scores</v-subheader>
            </div>
            <div style="display: flex;">
              <div
                  style="align-self: center; margin-top: auto; margin-bottom: auto; padding-top:16px; padding-bottom: 16px">
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
                        <th class="text-left">
                          <div style="white-space: nowrap">
                            set_value
                            <v-tooltip right>
                              <template v-slot:activator="{attrs, on}">
                                <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                              </template>
                              <div style="width:200px; text-align: justify">{{ tooltips['set_value'] }}</div>
                            </v-tooltip>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="metric in Object.keys(result.input_values.values.set_value)" :key="metric">
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
                        <td style="margin:4px">{{ formatValue(result.input_values.values.set_value[metric]) }}</td>
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
                          </b></td>
                          <td style="margin:4px" v-for="head in Object.keys(result.input_values.values)"
                              :key="metric+head">
                            {{ formatValue(result.input_values.values[head][metric]) }}
                          </td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                </div>
              </div>
              <div style="align-self: center; margin-top: auto; margin-bottom: auto;margin-left: 32px">
                <div v-if="mode!=='cluster'">
                  <p style="text-align: justify">Set: Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry.
                    Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap
                    into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                    the
                    release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing
                    software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div v-else>
                  <p style="text-align: justify"> Cluster: Lorem Ipsum is simply dummy text of the printing and
                    typesetting
                    industry.
                    Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap
                    into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                    the
                    release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing
                    software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div style="display:flex; justify-content: center">
              <v-subheader>Values</v-subheader>
            </div>
            <div style="display: flex;">
              <div
                  style="align-self: center; margin-top: auto; margin-bottom: auto; padding-top:16px; padding-bottom: 16px">
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
                        <th class="text-left">
                          <div style="white-space: nowrap">
                            set_value
                            <v-tooltip right>
                              <template v-slot:activator="{attrs, on}">
                                <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                              </template>
                              <div style="width:200px; text-align: justify">{{ tooltips['set_value'] }}</div>
                            </v-tooltip>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="metric in Object.keys(result.p_values.values.set_value)" :key="metric">
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
                        <td style="margin:4px">{{ formatValue(result.p_values.values.set_value[metric]) }}</td>
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
                            <div style="white-space: nowrap">
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
                          <td style="margin:4px" v-for="head in Object.keys(result.p_values.values)" :key="metric+head">
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
              <div style="align-self: center; margin-top: auto; margin-bottom: auto;margin-left: 32px">
                <div v-if="mode!=='cluster'">
                  <p style="text-align: justify">Set: Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry.
                    Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap
                    into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                    the
                    release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing
                    software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div v-else>
                  <p style="text-align: justify"> Cluster: Lorem Ipsum is simply dummy text of the printing and
                    typesetting
                    industry.
                    Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap
                    into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                    the
                    release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing
                    software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
              </div>
            </div>
            <v-divider></v-divider>
            <div style="display: flex; justify-content: center">
              <v-subheader>Figures</v-subheader>
            </div>
            <template v-if="plots">
              <div style="display: flex; justify-content: center" v-if="mode!=='cluster'">
                <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                  <v-img :src="getPlot('p-value')" max-width="90%"
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0" @click="downloadFile(getPlot('p-value'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>

                  </v-img>
                  <p style="text-align: justify"> Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap</p>
                </div>
                <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                  <v-img :src="getPlot('mappability')" max-width="90%"
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0" @click="downloadFile('mappability')">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <p style="text-align: justify"> Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap</p>
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
                      <v-tab @click="clusterMeasure='di'">
                        DI
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['di'] }}</div>
                        </v-tooltip>
                      </v-tab>
                      <v-tab @click="clusterMeasure='ss'">
                        SS
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['ss'] }}</div>
                        </v-tooltip>
                      </v-tab>
                      <v-tab @click="clusterMeasure='dbi'">
                        dbi
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips['dbi'] }}</div>
                        </v-tooltip>
                      </v-tab>
                    </v-tabs>
                    <v-img :src="getPlot(clusterMeasure+'_p-value')" max-width="80%"
                           style="margin-left:32px; margin-bottom:32px; position: relative">
                      <v-btn icon small style="position: absolute; right: 0"
                             @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                  <p style="text-align: justify"> Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap</p>
                </div>
                <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                  <v-img :src="getPlot('mappability')" max-width="90%"
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0" @click="downloadFile('mappability')">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
                  <p style="text-align: justify"> Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap</p>
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
      input: undefined,
      clusterMeasure: 'di',
      tooltips: {
        di: "Dunn Index:",
        ss: "Silhouette Score: measures how well an observation is clustered and it estimates the average distance between clusters.",
        dbi: "Davies Bouldin Index:",
        p_values: "Empirical P-value calculated using random runs from chosen background model.",
        set_value: "Calvulated value solely based on the input without the background model.",
        'go.BP': "Biological Process based on Gene Ontology.",
        'go.CC': "Cell Component based on Gene Ontology.",
        'go.MF': "Molecular Function based on Gene Ontology.",
        'pathway.kegg': "Pathways from Kyoto Encyclopedia of Genes and Genomes (KEGG)"
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
      }).catch(console.error)
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