<template>
  <div style="width: 100%;  padding: 16px">
    <div style="display: flex;">
      <v-btn color="error" @click="$emit('resetEvent')">Reset</v-btn>
      <header style="justify-self: center; margin-left: auto; margin-right: auto; padding-top: 32px">This is the
        validation score for your
        {{ type }}-{{ mode }}
        input.
      </header>
    </div>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <v-subheader v-if="!error && result ===undefined">Status: {{ status ? status : 'loading...' }}</v-subheader>
      <v-progress-linear :color="error?'error':'primary'" indeterminate v-if="result===undefined"></v-progress-linear>
      <div v-else>
        <v-simple-table v-if="mode==='set'">
          <tr>
            <th></th>
            <th align="left">inputValues</th>
            <th align="left">pValues</th>
          </tr>
          <tr v-for="metric in Object.keys(result.input_values.values.set_value)" :key="metric">
            <td>{{ metric }}</td>
            <td>{{ result.input_values.values.set_value[metric] }}</td>
            <td>{{ result.p_values[metric] }}</td>
          </tr>
        </v-simple-table>
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
      mode: undefined,
      type: undefined,
    }
  },

  created() {
    this.taskID = this.$route.query.result
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
      console.log(result)
      this.result = result.result
    },

    queryResult: function () {
      this.$http.getTaskResult(this.taskID).then(this.saveResult).catch(console.error)
    },

    queryStatus: function () {
      this.$http.getTaskStatus(this.taskID).then((response) => {
        console.log(response)
        if(!this.mode)
          this.mode = response.mode
        if(!this.type)
          this.type = response.type
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

    saveTaskId: function (response) {
      console.log(response)
      this.taskID = response.task
      this.$router.push("?result="+this.taskID)
      this.queryStatus()
    },
    execute: function () {
      this.step = 2
      switch (this.params.mode) {
        case "set": {
          this.$http.validate_set(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break;
        }
        case "id-set": {
          this.$http.validate_id_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "set-set": {
          this.$http.validate_set_set(this.params.targetID, this.params.target, this.params.referenceID, this.params.reference, this.params.runs, this.params.replace, this.params.enriched, this.params.distance, this.params.background).then(response => {
            this.saveTaskId(response)
          }).catch(() => {
            this.error = true
          })
          break
        }
        case "cluster": {
          this.$http.validate_cluster(this.params.targetID, this.params.target, this.params.runs, this.params.replace, this.params.distance, this.params.background).then(response => {
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