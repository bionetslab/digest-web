<template>
  <div style="width: 100%;  padding: 16px">
    <div style="display: flex;">
      <v-btn color="error" @click="reset()">Reset</v-btn>
      <header style="justify-self: center; margin-left: auto; margin-right: auto; padding-top: 32px">This is the
        validation result for your
        {{ type }}-{{ mode }}
        input.
      </header>
    </div>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <v-subheader></v-subheader>

      <div style="display: flex; justify-content: center">
        <v-subheader v-if="!error && result ===undefined">Status: {{ status ? status +(status ==="Queued"? "("+queueStats.queuePosition+"/"+queueStats.queueLength+")" : '') : "communicating..." }}</v-subheader>
        <v-subheader v-else>Results</v-subheader>
      </div>

      <v-progress-linear :color="error?'error':'primary'" indeterminate v-if="result===undefined"></v-progress-linear>
      <div v-else style="padding-left: 64px; padding-right: 64px">
        <div style="display: flex; justify-content: center" v-if="plots">
          <v-img v-for="img in plots" :key="img" :src="img" max-width="25vw" style="margin:32px"></v-img>
        </div>
        <div v-if="mode!=='cluster'" style="display: flex">
          <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
            <tr>
              <th></th>
              <th align="left">pValues</th>
            </tr>
            <tr v-for="metric in Object.keys(result.p_values.values.set_value)" :key="metric">
              <td style="padding:4px">{{ metric }}</td>
              <td style="padding:4px">{{ formatValue(result.p_values.values.set_value[metric]) }}</td>
            </tr>
          </v-simple-table>
          <v-simple-table style="justify-self: flex-end; margin-right: auto; margin-left: auto">
            <tr>
              <th></th>
              <th align="left">inputValues</th>
            </tr>
            <tr v-for="metric in Object.keys(result.input_values.values.set_value)" :key="metric">
              <td style="padding:4px">{{ metric }}</td>
              <td style="padding:4px">{{ formatValue(result.input_values.values.set_value[metric]) }}</td>
            </tr>
          </v-simple-table>
        </div>
        <div v-else>
          <div style="display: flex">
            <v-simple-table style="justify-self: flex-start; margin-right: auto; margin-left: auto">
              <tr>
                <th style="padding:4px">
                  <v-subheader>P-values</v-subheader>
                </th>
                <th style="padding:4px" align="left" v-for="head in Object.keys(result.p_values.values)"
                    :key="'p_'+head">{{ head }}
                </th>
              </tr>
              <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
                <td style="padding:4px">{{ metric }}</td>
                <td style="padding:4px" v-for="head in Object.keys(result.p_values.values)" :key="metric+head">
                  {{ formatValue(result.p_values.values[head][metric]) }}
                </td>
              </tr>
            </v-simple-table>
            <!--          </div>-->
            <!--          <div style="display: flex; justify-content: center">-->
            <v-simple-table style="justify-self: flex-end; margin-right: auto; margin-left: auto">
              <tr>
                <th style="padding:4px">
                  <v-subheader>Input-values</v-subheader>
                </th>
                <th style="padding:4px" align="left"
                    v-for="head in Object.keys(result.input_values.values).filter(k=>k !== 'ss_inter')"
                    :key="'i_'+head">{{ head }}
                </th>
              </tr>
              <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])" :key="metric">
                <td style="padding:4px">{{ metric }}</td>
                <td style="padding:4px"
                    v-for="head in Object.keys(result.input_values.values).filter(k=>k !== 'ss_inter')"
                    :key="metric+head">
                  {{ formatValue(result.input_values.values[head][metric]) }}
                </td>
              </tr>
            </v-simple-table>

          </div>
        </div>
      </div>
      <span v-if="error"><i>An error with following message occurred: {{ status }}</i></span>
    </v-sheet>
  </div>
</template>

<script>

import * as CONFIG from '../../Config'

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
      queueStats: undefined,
      mode: undefined,
      type: undefined,
      plots:undefined
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

    loadPlots: function(){
      this.$http.getResultFiles(this.taskID).then(files=>{
        this.plots = files.filter(file=>file.type==='png').map(file=>CONFIG.HOST_URL+"/result_file?name="+file.name)
        console.log(this.plots)
      }).catch(console.error)
    },


    queryResult: function () {
      this.$http.getTaskResult(this.taskID).then(this.saveResult).catch(console.error)
    },

    queryStatus: function () {
      this.$http.getTaskStatus(this.taskID).then((response) => {
        console.log(response)
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
      console.log(response)
      this.taskID = response.task
      this.$router.push("/result?id=" + this.taskID)
      this.queryStatus()
    },
    reset: function () {
      this.$router.push("/")
      this.$router.go()
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

<style scoped>

</style>