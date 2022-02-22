<template>
  <v-app>
    <v-main>
      <v-toolbar elevation="4" dense style="padding-left: 15vw; padding-right: 15vw">
          <v-toolbar-title>DIGEST-Web</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn depressed plain @click="checkRouting()">
            <router-link style="text-decoration: none" to="/">Home</router-link>
          </v-btn>
          <v-btn depressed plain>
            <router-link style="text-decoration: none" to="/documentation">Documentation</router-link>
          </v-btn>
          <v-btn depressed plain>
            <router-link style="text-decoration: none" to="/about">About</router-link>
          </v-btn>
      </v-toolbar>
      <v-card style="width: 70vw; justify-self: center; margin-left: auto; margin-right: auto">
        <router-view></router-view>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {},

  data: () => ({}),


  methods:{

    checkRouting:function(){
      if(this.$route.path === "/"){
        this.$router.push("/")
        this.$router.go()
      }
    }
  }

};
</script>
