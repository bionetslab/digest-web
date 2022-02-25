<template>
  <div>
    <div style="background-color: cornflowerblue; width: 100%; padding:16px">
      <h2 style="display: flex; justify-content: center; color: white; font-size: 4rem">Documentation</h2>
    </div>
    <div style="padding:64px">
      <b style="font-size: 1.5rem">Table of contents</b>
      <ul style="margin-bottom: 32px">
        <li><a :href="getAnchor('digest')">DIGEST</a></li>
        <li><a :href="getAnchor('web-app')">Web Application</a>
          <ul>
            <li><a :href="getAnchor('validation-modes')">Validation Modes</a></li>
            <li><a :href="getAnchor('parameters')">Parameters</a></li>
            <li><a :href="getAnchor('results')">Results</a></li>
          </ul>
        </li>
        <li><a :href="getAnchor('api')">RESTful API</a>
          <ul>
            <li><a :href="getAnchor('api-executions')">Execution Routes</a></li>
            <li><a :href="getAnchor('api-status')">Status Requesting</a></li>
            <li><a :href="getAnchor('api-results')">Result Routes</a></li>
          </ul>
        </li>
        <li><a :href="getAnchor('package')">Python Package</a></li>
      </ul>
      <b id="digest" style="font-size: 1.5rem; padding-top:48px;">DIGEST</b>
      <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
            href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.</p>
      <b id="web-app" style="font-size: 1.5rem; padding-top:48px;">Web Application</b>
      <p style="text-align: justify">
        DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
          href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.</p>
      <div style="padding-left: 16px">
        <b id="validation-modes" style="font-size: 1.25rem; padding-top:48px;">Validation Modes</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <div style="padding-left: 16px">
        <b id="parameters" style="font-size: 1.25rem; padding-top:48px;">Parameters</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Parameters</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <div style="padding-left: 16px">
        <b id="results" style="font-size: 1.25rem; padding-top:48px;">Results</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <b id="api" style="font-size: 1.5rem; padding-top:48px;">API</b>
      <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
            href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.</p>
      <div style="padding-left: 16px">
        <b id="api-executions" style="font-size: 1.25rem; padding-top:48px;">Execution Routes</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <div style="padding-left: 16px">
        <b id="api-status" style="font-size: 1.25rem; padding-top:48px;">Status Requesting</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Parameters</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <div style="padding-left: 16px">
        <b id="api-results" style="font-size: 1.25rem; padding-top:48px;">Result Routes</b>
        <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Result Routes</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation. </p>
      </div>
      <b id="package" style="font-size: 1.5rem; padding-top:48px;">Python package</b>
      <p style="text-align: justify"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
            href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">Execution Routes</a>. DIGEST greatly facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Documentation",

  methods: {
    getAnchor: function (anchor) {
      return "/documentation#" + anchor
    }
  }
}
</script>

<style scoped>

</style>