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
      <b id="digest" style="font-size: 1.5rem; padding-top:48px; margin-top:48px">DIGEST</b>
      <div style="text-align: justify; margin-bottom: 48px">
        DIGEST is a (“validation of <b>di</b>sease
        and <b>ge</b>ne <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
            href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.
      </div>
      <b id="web-app" style="font-size: 1.5rem; padding-top:48px;">Web Application</b>
      <div style="text-align: justify; margin-bottom: 48px">
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
        of empirical P-values with just a few mouse clicks.
      </div>
      <div style="padding-left: 16px">
        <b id="validation-modes" style="font-size: 1.25rem; padding-top:48px;">Validation Modes</b>
        <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
          <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to
          automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the
          computation.
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="parameters" style="font-size: 1.25rem; padding-top:48px;">Parameters</b>
        <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
          <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Parameters</a>. DIGEST greatly
          facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to
          automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the
          computation.
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="results" style="font-size: 1.25rem; padding-top:48px;">Results</b>
        <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
          <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">REST API</a>. DIGEST greatly facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to
          automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the
          computation.
        </div>
      </div>

      <b id="api" style="font-size: 1.5rem; padding-top:48px;">RESTful API</b>
      <div style="text-align: justify; margin-bottom: 48px">
        For programmatic access to the DIGEST web server, we provide a API endpoint:
        <code>api.digest-validation.net</code>. In the following we will explain how this route can be used to dispatch
        validation jobs, how to check the execution status and how to retrieve results of finished tasks.<br><br>
        In general, the API consists of:
        <ol>
          <li>A Django backend, accepting request</li>
          <li>A Redis service for queuing and executing tasks</li>
          <li>A PostgreSQL database to store valiation results</li>
        </ol>
      </div>
      <div style="padding-left: 16px">
        <b id="api-executions" style="font-size: 1.25rem; padding-top:48px;">Execution Routes</b>
        <div style="text-align: justify; margin-bottom: 48px">
          To submit validation tasks to the API, four enpoints exist, mimicing the four different <a
            href="https://github.com/bionetslab/digest#run-in-terminal" style="text-decoration: none">modes of DIGEST
          <v-icon color="primary" right small style="margin-top:-5px">fas fa-arrow-up-right-from-square</v-icon>
        </a>
          <ul>
            <li>set
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/set</code></li>
            <li>id-set
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/id_set</code></li>
            <li>set-set
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/set_set</code></li>
            <li>cluster
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/cluster</code></li>
          </ul>
          <br>
          Payload key names for the <b>POST</b> object are identical to parameter names within the DIGEST package

          <v-tabs v-model="apiParamModel">
            <v-tab>set</v-tab>
            <v-tab>id-set</v-tab>
            <v-tab>set-set</v-tab>
            <v-tab>cluster</v-tab>
          </v-tabs>
          <v-tabs-items v-model="apiParamModel">
            <v-tab-item style="display: flex; justify-content: flex-start">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>
                      Parameter
                    </th>
                    <th>
                      Type
                    </th>
                    <th>
                      Default
                    </th>
                    <th>
                      Example
                    </th>
                    <th style="width:50%">
                      Description
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>target_id</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{target_id:'symbol'}</code> </td>
                    <td>Describes the ID space of the target input. For genes has to be one of <code>['entrez','ensembl','symbol','uniprot']</code> or for disorders one of <code>['mondo','omim','snomedct','umls','orpha','mesh','doid','ICD-10']</code></td>
                  </tr>
                  <tr>
                    <td>target</td>
                    <td>array</td>
                    <td>[ ]</td>
                    <td><code>{target:['PTEN','TP53','BRCA2']}</code></td>
                    <td>Provides a list of target genes or disorders in the selected ID space. the entries have to be in <b><i>string</i></b> format!</td>
                  </tr>
                  <tr>
                    <td>runs</td>
                    <td>integer</td>
                    <td>1000</td>
                    <td><code>{runs:1000}</code></td>
                    <td>Defines how many times sets are sampled for the p-value calculation.</td>
                  </tr>
                  <tr>
                    <td>replace</td>
                    <td>integer</td>
                    <td>100</td>
                    <td><code>{replace:80}</code></td>
                    <td>Defines the percentage of elements of the original set to be altered by sampling.</td>
                  </tr>
                  <tr>
                    <td>distance</td>
                    <td>string</td>
                    <td>jaccard</td>
                    <td><code>{distance:'jaccard'}</code></td>
                    <td>Sets the distance measure to be used to determine similarity between target and sampeled sets. Has to be one of <code>['jaccard','overlap']</code></td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                    <td>string</td>
                    <td>complete</td>
                    <td><code>{distance:'complete'}</code></td>
                    <td>Sets the background model, determining how sets for p-value calculation are sampled. Has to be one of <code>['complete','term-pres']</code></td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{type:'gene'}</code></td>
                    <td>Can be used to save the type of the target set with the job. It is not used for computation but is returned when requesting the job status. Can be anything but should be one of <code>['disease','gene']</code></td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
            <v-tab-item style="display: flex; justify-content: flex-start">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>
                      Parameter
                    </th>
                    <th>
                      Type
                    </th>
                    <th>
                      Default
                    </th>
                    <th>
                      Example
                    </th>
                    <th>
                      Description
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>target_id</td>
                  </tr>
                  <tr>
                    <td>target</td>
                  </tr>
                  <tr>
                    <td>reference_id</td>
                  </tr>
                  <tr>
                    <td>reference</td>
                  </tr>
                  <tr>
                    <td>runs</td>
                  </tr>
                  <tr>
                    <td>replace</td>
                  </tr>
                  <tr>
                    <td>enriched</td>
                  </tr>
                  <tr>
                    <td>distance</td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
            <v-tab-item>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>
                      Parameter
                    </th>
                    <th>
                      Type
                    </th>
                    <th>
                      Default
                    </th>
                    <th>
                      Example
                    </th>
                    <th>
                      Description
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>target_id</td>
                  </tr>
                  <tr>
                    <td>target</td>
                  </tr>
                  <tr>
                    <td>reference_id</td>
                  </tr>
                  <tr>
                    <td>reference</td>
                  </tr>
                  <tr>
                    <td>runs</td>
                  </tr>
                  <tr>
                    <td>replace</td>
                  </tr>
                  <tr>
                    <td>enriched</td>
                  </tr>
                  <tr>
                    <td>distance</td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
            <v-tab-item>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>
                      Parameter
                    </th>
                    <th>
                      Type
                    </th>
                    <th>
                      Default
                    </th>
                    <th>
                      Example
                    </th>
                    <th>
                      Description
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>target_id</td>
                  </tr>
                  <tr>
                    <td>target</td>
                  </tr>
                  <tr>
                    <td>runs</td>
                  </tr>
                  <tr>
                    <td>replace</td>
                  </tr>
                  <tr>
                    <td>distance</td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>

        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="api-status" style="font-size: 1.25rem; padding-top:48px;">Status Requesting</b>
        <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
          <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Parameters</a>. DIGEST greatly
          facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to
          automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the
          computation.
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="api-results" style="font-size: 1.25rem; padding-top:48px;">Result Routes</b>
        <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
          <b>s</b>ets or
          clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
              href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
          <a href="https://digest-validation.net/documentation" target="_blank">Result Routes</a>. DIGEST greatly
          facilitates
          <i>in silico</i> validation of gene and disease sets or clusterings via fully
          automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
          shared
          genes and variants, and background distribution estimation. Moreover, functionality is provided to
          automatically
          update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
          significance of candidate mechanisms with regard to functional and genetic coherence and enables the
          computation.
        </div>
      </div>

      <b id="package" style="font-size: 1.5rem; padding-top:48px;">Python package</b>
      <div style="text-align: justify; margin-bottom: 48px"> DIGEST is a (“validation of <b>di</b>sease and <b>ge</b>ne
        <b>s</b>ets or
        clus<b>t</b>erings”), is a Python-based validation tool available as a webinterface, as a <a
            href="https://pypi.org/project/biodigest/" target="_blank">standalone package</a>, or over a
        <a href="https://digest-validation.net/documentation" target="_blank">Execution Routes</a>. DIGEST greatly
        facilitates
        <i>in silico</i> validation of gene and disease sets or clusterings via fully
        automated validation pipelines comprising disease and gene ID mapping, enrichment analysis, comparisons of
        shared
        genes and variants, and background distribution estimation. Moreover, functionality is provided to automatically
        update the external databases used by the pipelines. DIGEST hence allows the user to assess the statistical
        significance of candidate mechanisms with regard to functional and genetic coherence and enables the computation
        of empirical P-values with just a few mouse clicks.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Documentation",
  data() {
    return {
      apiParamModel: 0,
    }
  },
  methods: {
    getAnchor: function (anchor) {
      return "/documentation#" + anchor
    }
  }
}
</script>

<style scoped>

</style>
