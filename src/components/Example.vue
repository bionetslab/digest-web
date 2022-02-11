<template>
  <v-card width="400px">
    <v-card-title>Example Table</v-card-title>
    <v-card-subtitle>Load content of example table from backend:</v-card-subtitle>
    <v-card-actions>
      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <v-btn @click="loadAll" color="primary" style="justify-self: center; margin-left: auto; margin-right: auto"
                 v-on="on" v-bind="attrs">
            Load
            all
          </v-btn>
        </template>
        <div>Loads <i><b>all</b></i> entries of the example prostgreSQL table from the django backend!</div>
      </v-tooltip>
    </v-card-actions>
    <v-card-subtitle style="display: flex; justify-content: center;"><span>or</span></v-card-subtitle>
    <v-card-actions>
      <div style="width: 100%; display: flex; margin: auto; justify-content: center">
        <v-select label="number" :items="numbers" v-model="number"
                  style="width: 75px; max-width: 75px; margin-right: 15px"></v-select>
        <v-btn @click="load" color="primary" style="margin-top:15px;">Load</v-btn>
      </div>

    </v-card-actions>
    <v-card-actions>

    </v-card-actions>
    <v-card-text v-if="examples!=null">
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Number
            </th>
            <th class="text-left">
              Name
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="example in examples"
              :key="example.number"
          >
            <td>{{ example.number }}</td>
            <td>{{ example.name }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Example",


  data() {
    return {
      examples: [],
      numbers: [0, 1, 2, 3, 4],
      number: undefined,
    }
  },

  methods: {

    loadAll: function () {
      this.number = undefined
      console.log("click")
      this.$http.post("/set",{target_id:'symbol',target:["TNFRSF1A","CFTR","FCGR2A","STX1A"]}).then(response => {
        console.log(response)
      })
    },

    load: function () {
      this.examples = []
      if (this.number != null)
        this.$http.getExample(this.number).then(response => {
          this.examples.push(response.data.examples)
        })
    }

  }
}
</script>

<style scoped>

</style>
