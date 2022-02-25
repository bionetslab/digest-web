<template>
  <div>
    <div style="background-color: cornflowerblue; width: 100%; padding:16px">
      <h2 style="display: flex; justify-content: center; color: white; font-size: 4rem">About</h2>
    </div>
    <div style="padding:32px 64px">
      <b style="font-size: 1.5rem;">DIGEST</b>
      <p style="text-align: justify; margin-top: 16px; margin-bottom: 32px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.</p>

      <b style="font-size: 1.5rem">Resources</b>
      <div style="margin-top: 16px; margin-bottom: 32px">
        <div><v-btn icon><a style="text-decoration: none" target="_blank" href="https://pypi.org/project/biodigest/"><v-icon>fab fa-python</v-icon></a></v-btn>Python package (biodigest)</div>
        <div><v-btn icon><a style="text-decoration: none" target="_blank" href="https://github.com/bionetslab/digest"><v-icon>fab fa-github</v-icon></a></v-btn>DIGEST source code</div>
        <div><v-btn icon><a style="text-decoration: none" target="_blank" href="https://github.com/bionetslab/digest-tutorial/blob/main/Tutorial.ipynb"><v-icon>fas fa-graduation-cap</v-icon></a></v-btn>DIGEST tutorial material</div>
      </div>


      <b  style="font-size: 1.5rem">Contact</b>
      <div style="margin-top: 16px; margin-bottom: 32px">
        <div><v-btn icon><a style="text-decoration: none" :href="'mailto:'+getKAMail()"><v-icon>fas fa-envelope</v-icon></a></v-btn>klaudia.adamowicz(_at-]uni-hamburg.de</div>
        <div><v-btn icon><a style="text-decoration: none" :href="'mailto:'+getDBMail()"><v-icon>fas fa-envelope</v-icon></a></v-btn>david.b.blumenthal(_at-]fau.de</div>
      </div>
      <b style="font-size: 1.5rem">Cite</b>
      <p style="margin-top: 16px; margin-bottom: 64px"><i>Will be added once available</i></p>
      <b style="justify-content: center; display: flex;font-size: 1.25rem; color: #484848">Impressum</b>
      <div style="height: .85rem"></div>
      <span style="justify-content: center; display: flex; font-size: .85rem">Prof. Dr. Jan Baumbach</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">Chair of Computational Systems Biology</span>
      <div style="height: .85rem"></div>
      <span style="justify-content: center; display: flex; font-size: .85rem">Phone: +49-40-42838-7313</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">E-Mail: <a :href="'mailto:'+getMail()">cosy[at)zbh.uni-hamburg.de</a></span>
      <span style="justify-content: center; display: flex; font-size: .85rem">Address: Prof. Dr. Jan Baumbach</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">University of Hamburg</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">Notkestraße 9</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">22607 Hamburg</span>
      <span style="justify-content: center; display: flex; font-size: .85rem">Germany</span>
    </div>


  </div>
</template>

<script>
export default {
  name: "About",

  methods: {
    getMail: function () {
      let mail = "zbh.uni-hamburg.de"
      mail = "cosy" + mail
      mail = mail.split("z").join("b@z")
      return mail
    },
    getKAMail: function () {
      let mail = "-hamburg.de"
      mail = "klaudia.adamowicz" + mail
      mail = mail.split("z").join("z@uni")
      return mail
    },
    getDBMail: function () {
      let mail = "fau.de"
      mail = "david.b.blument" + mail
      mail = mail.split("f").join("hal@f")
      return mail
    }
  }

}
</script>

<style scoped>

</style>