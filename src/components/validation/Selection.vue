<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <v-card style="width: 45%; height: 300px; margin:8px">
      <v-card-title>Set</v-card-title>
      <v-card-subtitle style="height: 52px">Compare similarity inside the set.</v-card-subtitle>
      <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
        <v-card style="width: 50%; height: 200px;" :elevation="hover_set_gene ? 10:0" :flat="!hover_set_gene"
                @mouseenter="hover_set_gene=true" @mouseleave="hover_set_gene=false">
          <v-img
              class="white--text align-end"
              height="200px"
              src="https://media.istockphoto.com/photos/blue-chromosome-dna-and-gradually-glowing-flicker-light-matter-when-picture-id1297146235?b=1&k=20&m=1297146235&s=170667a&w=0&h=vUyHfisjnfzyhzeZvYzt23iaHSEl6UkpoiFctK4BMbc="
          >
            <v-card-title>Gene</v-card-title>
            <v-card-subtitle v-show="hover_set_gene">asdfj saöldfj aösldkfj aösdklfa södklf asödlfkja södlfkjas
              ödflkjsd öflksajd föskldj f
            </v-card-subtitle>
            <v-card-actions v-show="hover_set_gene">
              <div style="width: 100%; display: flex; justify-content: center">
                <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:'gene',mode:'set'})">
                  Validate
                </v-btn>
              </div>
            </v-card-actions>
          </v-img>
        </v-card>
        <v-card style="width: 50%; height: 200px;" :elevation="hover_set_disorder ? 10:0"
                :flat="!hover_set_disorder" @mouseenter="hover_set_disorder=true"
                @mouseleave="hover_set_disorder=false">
          <v-img
              class="white--text align-end"
              height="200px"
              src="https://images.medicinenet.com/images/article/main_image/what-is-conversion-disorder.jpg"
          >
            <v-card-title>Disease</v-card-title>
            <v-card-subtitle v-show="hover_set_disorder">asdfj saöldfj aösldkfj aösdklfa södklf asödlfkja
              södlfkjas ödflkjsd öflksajd föskldj f
            </v-card-subtitle>
            <v-card-actions v-show="hover_set_disorder">
              <div style="width: 100%; display: flex; justify-content: center">
                <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:'disease',mode:'set'})">
                  Validate
                </v-btn>
              </div>
            </v-card-actions>
          </v-img>
        </v-card>
      </div>
    </v-card>
    <v-card style="width: 45%; height: 300px; margin:8px">
      <v-card-title>Cluster
      </v-card-title>
      <v-card-subtitle style="height: 52px">Compare inter and intra cluster similarities.</v-card-subtitle>
      <div style="width: 100%; display: flex; align-self: flex-end; margin-top: auto; margin-bottom: auto;">
        <v-card style="width: 50%; height: 200px;" :elevation="hover_cluster_gene ? 10:0"
                :flat="!hover_cluster_gene"
                @mouseenter="hover_cluster_gene=true" @mouseleave="hover_cluster_gene=false">
          <v-img
              class="white--text align-end"
              height="200px"
              src="https://media.istockphoto.com/photos/blue-chromosome-dna-and-gradually-glowing-flicker-light-matter-when-picture-id1297146235?b=1&k=20&m=1297146235&s=170667a&w=0&h=vUyHfisjnfzyhzeZvYzt23iaHSEl6UkpoiFctK4BMbc="
          >
            <v-card-title>Gene</v-card-title>
            <v-card-subtitle v-show="hover_cluster_gene">asdfj saöldfj aösldkfj aösdklfa södklf asödlfkja
              södlfkjas
              ödflkjsd öflksajd föskldj f
            </v-card-subtitle>
            <v-card-actions v-show="hover_cluster_gene">
              <div style="width: 100%; display: flex; justify-content: center">
                <v-btn depressed color="primary" @click="$emit('startValidationEvent',{type:'gene',mode:'cluster'})">
                  Validate
                </v-btn>
              </div>
            </v-card-actions>
          </v-img>
        </v-card>
        <v-card style="width: 50%; height: 200px;" :elevation="hover_cluster_disorder ? 10:0"
                :flat="!hover_cluster_disorder" @mouseenter="hover_cluster_disorder=true"
                @mouseleave="hover_cluster_disorder=false">
          <v-img
              class="white--text align-end"
              height="200px"
              src="https://images.medicinenet.com/images/article/main_image/what-is-conversion-disorder.jpg"
          >
            <v-card-title>Disease</v-card-title>
            <v-card-subtitle v-show="hover_cluster_disorder">asdfj saöldfj aösldkfj aösdklfa södklf asödlfkja
              södlfkjas ödflkjsd öflksajd föskldj f
            </v-card-subtitle>
            <v-card-actions v-show="hover_cluster_disorder">
              <div style="width: 100%; display: flex; justify-content: center">
                <v-btn depressed color="primary"
                       @click="$emit('startValidationEvent',{type:'disease',mode:'cluster'})">Validate
                </v-btn>
              </div>
            </v-card-actions>
          </v-img>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Selection",


  data: () => ({
    hover_set_gene: false,
    hover_set_disorder: false,
    hover_cluster_gene: false,
    hover_cluster_disorder: false
  }),


  created() {
  }
}
</script>

<style scoped>

</style>