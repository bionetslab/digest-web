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
        In order to simplify the use and to allow access to the validation even for users without any programming
        experience,
        we offer a web service that allows a quick and easy validation and calculation of statistical significance with
        just a few clicks.
      </div>
      <div style="padding-left: 16px">
        <b id="validation-modes" style="font-size: 1.25rem; padding-top:48px;">Validation Modes</b>
        <div style="text-align: justify; margin-bottom: 48px">
          <b>Set</b>
          <ul>
            <li><b>Reference-free</b><br> If a set of IDs is entered without reference, the individual IDs are checked
              in pairs for similarity and converted to a distance measure. For this purpose, functional annotations or,
              in the case of disease sets, additional genetic annotations are used to determine a functional and genetic
              coherence. The average distance with respect to the respective annotations is returned as relevance
              scores.
            </li>
            <li><b>Against reference</b><br> All annotations from the reference set that are assigned to at least
              one reference ID are combined as a comparison set. As an exception, there is an optional enriched mode for
              gen reference IDs, where the assigned annotations are limited to only the enriched ones. This is used to
              compare each target ID separately based on the values annotated to that ID. If the target ID matches the
              reference annotation set in at least one annotation, this ID is considered to be associated. The relevance
              score in this mode is the number of target IDs identified as related.
            </li>
            <br>
            In both reference-free and reference set modes, random target sets are generated based on a user-selected
            background model, with which relevance scores are calculated in the same way. These are finally used to
            determine the significance of the target set entered by the user with the help of empirical p-values.
          </ul>
          <b>Clustering</b><br>
          <ul>Here, clustering is assessed using 3 well-known cluster quality measures,
            the Dunn Index, the Silhouette Score, and the, Davies-Bouldin index. In all of these quality measures, intra
            distances within clusters and inter distances between them are calculated and used. To determine these
            distances, pairwise distance measures are required, which are calculated the same way as in the
            reference-free
            set mode. For each functional and genetic annotation, depending on whether the cluster IDs originate from
            genes or diseases, three scores are given, one for each of the quality scores described above, in contrast
            to
            the set mode, where one relevance score is calculated for each.<br>
            Finally, with a background model, not the IDs but the cluster assignments are randomly reassigned,
            while the size and distribution of the respective clusters as well as the original IDs are preserved.
            The relevance scores calculated based on the new randomly generated clusterings are used here to determine
            the significance of quality measure values on the clustering passed by the user with the help of empirical
            P-values.
          </ul>
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="parameters" style="font-size: 1.25rem; padding-top:48px;">Parameters</b>
        <div style="text-align: justify; margin-bottom: 48px">
          <ul>
            <li><b>Targets</b>
              <ul>
                <li><b>Target ID type:</b> To ensure a validation fit for the input, it is important to select the
                  correct ID
                  type of your input. At *** you can check the supported ID types, which will also be showed in the
                  drop-down
                  during the setup.
                </li>
                <li><b>Upload targets:</b> Upload a file with your IDs. It is important to have the correct format in
                  the file.
                  Inside the file the IDs should be new line separated. Additionally for the clustering, the cluster
                  assignment
                  should be tab separated next to the id. <i>The files should not have a header!</i></li>
                <li><b>Target IDs field:</b> After using the upload function, your IDs will be visible in this field.
                  Here you can freely change individual entries to your desire. If you don't want to use the upload
                  function,
                  you can also just insert your input manually.
                </li>
              </ul>
            <li><b>References</b> (optional in set mode)</li>
            <ul>
              <li><b>Reference type:</b> Choose the type of the reference to ensure the correct validation.
                The reference can consist of either disease or gene IDs independent of the target reference type.
              </li>
              <li><b>Reference ID type:</b> Similar to the target ID type, a correct selection of the ID type is
                necessary.
                The reference ID type does not have to be of the same type as the target.
              </li>
              <li><b>Upload reference:</b> Easy way to load the reference ID(s) from a file. Keep in mind to have the
                correct format inside the file described under <i>upload targets</i>.
              </li>
              <li><b>Reference IDs field:</b> Uploaded IDs will show up in this field and allow individual changes.
                This field can also be used to insert your reference manually. Keep in mind that a reference consisting
                of a single ID is sufficient.
              </li>
            </ul>
            <li><b>Enriched:</b> If you use a reference gene set of more than one element, you can limit the functional
              annotations of the reference to only enriched ones that will later function as the comparison set for the
              target annotations.
            </li>
            <li><b>Similarity measure</b>
              <ul>
                The similarity of IDs is determined based on assigned annotations. For this purpose, the respective sets
                of annotations are evaluated by one of two possible units of measurement. Choose wisely, as depending on
                the similarity measure, the results can change immensely.
                <li><b>Jaccard index:</b> This measure calculates the similarity by dividing the intersection if two
                  sets
                  with the union of them. This measure is not directly influenced by the individual sizes of the sets
                  and
                  therefore wouldn't favor real subsets during comparison.
                </li>
                <li><b>Overlap coefficient:</b> Here the measure calculated by dividing the intersection of two sets by
                  the
                  length of the smaller set. Here the size of sets has a great influence and in addition this measure
                  for
                  example will identify subsets as perfect similarity.
                </li>
              </ul>
            </li>
            <li><b>Background model</b>
              <ul>
                Models to create random input sets to compare against the original target input for generation of
                empirical P-values.
                <li><b>Fully randomized in clustering mode:</b> For this purpose, the assignment of the clusters is
                  shuffled,
                  whereby the number and the distribution of the clusters as well as the original IDs are retained.
                </li>
                <li><b>Fully randomized in set mode:</b> Here the original target IDs added by the user are exchanged
                  with other
                  randomly chosen IDs of the same type, while the size of the set remains the same.
                </li>
                <li><b>Term-size preserving in set mode:</b> As in the fully randomize model, the target IDs are
                  replaced,
                  but more than just the size of the set is preserved. Here, the IDs are replaced by other IDs of the
                  same
                  type that also have approximately the same number of functional and/or genetic annotations.
                </li>
              </ul>
            </li>
            <li><b>Runs:</b> This is the number of random target inputs generated by the selected background model that
              are used for the significance calculation. We recommend a number of at least 1000 to calculate meaningful
              empirical P-values.
            </li>
            <li><b>Replace:</b> If a selected background model should not change cluster assignments or replace IDs of
              the entire user target input, you can specify here in percent how much of the original input per run
              should be
              affected by the background model. The default value is 100, which means that the entire input is affected.
            </li>
          </ul>
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="results" style="font-size: 1.25rem; padding-top:48px;">Results</b>
        <div style="text-align: justify; margin-bottom: 48px">
          Depending on the input types for the targets and optionally also the reference, functional annotations based
          on
          biological process, molecular function and cell component from <i>Gene Ontology (GO)</i> and <i>KEGG</i>
          pathways,
          as well as genetic annotations based on shared genes and variants from <i>DisGeNET</i>, are used for
          validation.
          <ul><br>
            <li><b>P-value table:</b> The most important result to be found in the section are the calculated
              <b>empirical P-values</b> using the selected background model and other parameters that indicate the
              significance of the calculated relevance scores derived from the input.
            </li>
            <li><b>Relevance score(s) table:</b> For completeness, the user receives a table with the functional or
              genetic relevance score(s) determined for solely their input.
            </li>
            <li><b>P-value plot:</b> In addition, the calculated P-values are displayed in a plot with a plotted cut-off
              line at 0.05, which can be used directly by the user for a presentation of the results.
            </li>
            <li><b>Mappability plot:</b> Since the annotations are taken from biological databases, which are known to
              have a study bias whereby some IDs have a high number of annotations and others have no annotations, the
              last plot shows which frequency of input IDs had non-empty annotations.
            </li>
          </ul>
          <br>
          All results are downloadable individually and as a whole in a zip. In addition, the user can download his
          setup
          including input and all parameter selections. The results get their own URL with a fixed ID, which can be used
          to return to the results at any time.
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
            :href="getAnchor('validation-modes')">modes
        </a> of DIGEST:
          <ul>
            <li>set
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/set</code></li>
            <li>set-set
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/set_set</code></li>
            <li>cluster
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>POST </b>api.digest-validation.net/cluster</code></li>
          </ul>
          <br>
          The attribute names for the <b>POST</b> request object are identical to parameter names within the DIGEST
          package. For detailed explanations about the influence of the parameters, please check the <a
            :href="getAnchor('parameters')">section above</a>!
          <v-tabs v-model="apiParamModel">
            <v-tab>set</v-tab>
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
                    <td><code>{target_id:'symbol'}</code></td>
                    <td>Describes the ID space of the target input. For genes has to be one of <code>['entrez','ensembl','symbol','uniprot']</code>
                      or for disorders one of
                      <code>['mondo','omim','snomedct','umls','orpha','mesh','doid','ICD-10']</code></td>
                  </tr>
                  <tr>
                    <td>target</td>
                    <td>array</td>
                    <td>[ ]</td>
                    <td><code>{target:['PTEN','TP53','BRCA2']}</code></td>
                    <td>Provides a list of target genes or disorders in the selected ID space. the entries have to be in
                      <b><i>string</i></b> format!
                    </td>
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
                    <td>Sets the distance measure to be used to determine similarity between target and sampeled sets.
                      Has to be one of <code>['jaccard','overlap']</code></td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                    <td>string</td>
                    <td>complete</td>
                    <td><code>{background_model:'complete'}</code></td>
                    <td>Sets the background model, determining how sets for p-value calculation are sampled. Has to be
                      one of <code>['complete','term-pres']</code></td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{type:'gene'}</code></td>
                    <td>Can be used to save the type of the target set with the job. It is not used for computation but
                      is returned when requesting the job status. Can be anything but should be one of <code>['disease','gene']</code>
                    </td>
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
                    <td>string</td>
                    <td>-</td>
                    <td><code>{target_id:'symbol'}</code></td>
                    <td>Describes the ID space of the target input. For genes has to be one of <code>['entrez','ensembl','symbol','uniprot']</code>
                      or for disorders one of
                      <code>['mondo','omim','snomedct','umls','orpha','mesh','doid','ICD-10']</code></td>
                  </tr>
                  <tr>
                    <td>target</td>
                    <td>array</td>
                    <td>[ ]</td>
                    <td><code>{target:['PTEN','TP53','BRCA2']}</code></td>
                    <td>Provides a list of target genes or disorders in the selected ID space. the entries have to be in
                      <b><i>string</i></b> format!
                    </td>
                  </tr>
                  <tr>
                    <td>reference_id</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{reference_id:'symbol'}</code></td>
                    <td>Describes the ID space of the reference input. For genes has to be one of <code>['entrez','ensembl','symbol','uniprot']</code>
                      or for disorders one of
                      <code>['mondo','omim','snomedct','umls','orpha','mesh','doid','ICD-10']</code></td>
                  </tr>
                  <tr>
                    <td>reference</td>
                    <td>array</td>
                    <td>[ ]</td>
                    <td><code>{reference:['PTEN','TP53','BRCA2']}</code></td>
                    <td>Provides a list of reference genes or disorders in the selected ID space. the entries have to be
                      in <b><i>string</i></b> format!
                    </td>
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
                    <td>enriched</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td><code>{enriched:false}</code></td>
                    <td>Limits functional annotations of the reference set to only enriched ones. <b>Requires more than
                      one reference entry!</b></td>
                  </tr>
                  <tr>
                    <td>distance</td>
                    <td>string</td>
                    <td>jaccard</td>
                    <td><code>{distance:'jaccard'}</code></td>
                    <td>Sets the distance measure to be used to determine similarity between target and sampeled sets.
                      Has to be one of <code>['jaccard','overlap']</code></td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                    <td>string</td>
                    <td>complete</td>
                    <td><code>{distance:'complete'}</code></td>
                    <td>Sets the background model, determining how sets for p-value calculation are sampled. Has to be
                      one of <code>['complete','term-pres']</code></td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{type:'gene'}</code></td>
                    <td>Can be used to save the type of the target set with the job. It is not used for computation but
                      is returned when requesting the job status. Can be anything but should be one of <code>['disease','gene']</code>
                    </td>
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
                    <td>string</td>
                    <td>-</td>
                    <td><code>{target_id:'symbol'}</code></td>
                    <td>Describes the ID space of the target input. For genes has to be one of <code>['entrez','ensembl','symbol','uniprot']</code>
                      or for disorders one of
                      <code>['mondo','omim','snomedct','umls','orpha','mesh','doid','ICD-10']</code></td>
                  </tr>
                  <tr>
                    <td>target</td>
                    <td>array</td>
                    <td>[ ]</td>
                    <td><code>{target:[{id:'PTEN',cluster:'cl1'},{id:'TP53',cluster:'cl1'},{id:'BRCA2',
                      cluster:'cl2'}]}</code></td>
                    <td>Provides a list of target genes or disorders in the selected ID space with according clusters.
                      The entries have to be in the format of <code>{id: <i>entryID</i>, cluster:
                        <i>clusterName</i>}</code>!
                    </td>
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
                    <td>Sets the distance measure to be used to determine similarity between target and sampeled sets.
                      Has to be one of <code>['jaccard','overlap']</code></td>
                  </tr>
                  <tr>
                    <td>background_model</td>
                    <td>string</td>
                    <td>complete</td>
                    <td><code>{distance:'complete'}</code></td>
                    <td>Sets the background model, determining how sets for p-value calculation are sampled. Has to be
                      one of <code>['complete','term-pres']</code></td>
                  </tr>
                  <tr>
                    <td>type (optional)</td>
                    <td>string</td>
                    <td>-</td>
                    <td><code>{type:'gene'}</code></td>
                    <td>Can be used to save the type of the target set with the job. It is not used for computation but
                      is returned when requesting the job status. Can be anything but should be one of <code>['disease','gene']</code>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div style="margin-top: 16px">
          <p>The <b>response</b> object contains an taskID (e.g.
            <code>{task:'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'</code>) with which the status and the results with the
            referenced task can be requested.</p>
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="api-status" style="font-size: 1.25rem; padding-top:48px;">Status Requesting</b>
        <div style="text-align: justify; margin-bottom: 48px">
          To get information about the submitted validation task including it's execution status the following route can
          be used:
          <ul style="margin-bottom: 32px">
            <li>status
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>GET </b>api.digest-validation.net/status?task=$task</code></li>
          </ul>
          The response object will include the following attributes:
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
                  Example
                </th>
                <th style="width:50%">
                  Description
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>task</td>
                <td>string</td>
                <td><code>{task:'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'}</code></td>
                <td>Repeats the taskID used to request the status entry.</td>
              </tr>
              <tr>
                <td>failed</td>
                <td>boolean</td>
                <td><code>{failed: false}</code></td>
                <td>If execution fails this will be set to <code>true</code> and an error message will be set in the <i>status</i>
                  field.
                </td>
              </tr>
              <tr>
                <td>done</td>
                <td>boolean</td>
                <td><code>{done:true}</code></td>
                <td>If validation is successfully finished this will be set to <code>true</code> and means that the <a
                    :href="getAnchor('api-results')">result can be requested</a>.
                </td>
              </tr>
              <tr>
                <td>status</td>
                <td>string</td>
                <td><code>{status:'Executing'}</code></td>
                <td>A field to communicate the status of the validation execution. Can be but is not limited to : <code>'Initialized',
                  'Queued', 'Executing', 'Done'</code> or in case of an error, the first line of the thrown exception.
                </td>
              </tr>
              <tr>
                <td>stats</td>
                <td>object</td>
                <td><code>{stats:{queueLength:3, queuePosition:2}}</code></td>
                <td>Reflects the current spot of the task in the queue.</td>
              </tr>
              <tr>
                <td>mode</td>
                <td>string</td>
                <td><code>{mode:'set-set'}</code></td>
                <td>Shows the validation mode, one of <code>['set', 'set-set', 'cluster']</code></td>
              </tr>
              <tr>
                <td>type</td>
                <td>string</td>
                <td><code>{type:'gene'}</code></td>
                <td>Shows the type of targets used, can be <code>'gene'</code> or <code>'disorder'</code> in case it was
                  set on task requesting.
                </td>
              </tr>
              <tr>
                <td>input</td>
                <td>object</td>
                <td><code>{...}</code></td>
                <td>Holds a copy of the specific request.</td>
              </tr>
              <tr>
                <td>progress</td>
                <td>float</td>
                <td><code>{progress:0.7}</code></td>
                <td>While execution is ongoing this will hold a float between <code>0.0</code> and <code>1.0</code>.
                  Once <code>'Done'</code> will be set to <code>1.0</code>.
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </div>

      <div style="padding-left: 16px">
        <b id="api-results" style="font-size: 1.25rem; padding-top:48px;">Result Routes</b>
        <div style="text-align: justify; margin-bottom: 48px">
          To get the results of a validation task, once the status was communicated as terminated, the following route is used:
          <ul style="margin-bottom: 32px">
            <li>status
              <v-icon left right small style="margin-top:-2px">fas fa-arrow-right</v-icon>
              <code><b>GET </b>api.digest-validation.net/result?task=$task</code></li>
          </ul>
          The response object will include the following attributes:
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
                  Example
                </th>
                <th style="width:50%">
                  Description
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>task</td>
                <td>string</td>
                <td><code>{task:'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'}</code></td>
                <td>Repeats the taskID used to request the status entry.</td>
              </tr>
              <tr>
                <td>result</td>
                <td>boolean</td>
                <td><code>{ input_values:{...}, p_values: {...}}</code></td>
                <td>Contains the raw json formatted result of the DIGEST tool. How result values are stored there can be checked in the <a href="https://github.com/bionetslab/digest-tutorial/blob/main/Tutorial.ipynb" target="_blank">DIGEST tutorial</a>.
                </td>
              </tr>
              <tr>
                <td>parameters</td>
                <td>object</td>
                <td><code>{...}</code></td>
                <td>Holds a copy of the specific, requested parameters used for the validation.</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </div>

      <b id="package" style="font-size: 1.5rem; padding-top:48px;">Python package</b>
      <div style="text-align: justify; margin-bottom: 48px">
        DIGEST can also be included and used by the user in their own python code. For this purpose, DIGEST has been
        published as a python package named <a href="https://pypi.org/project/biodigest/">biodigest</a> on Pypi
        to ensure easy installation.<br>
        <code>pip install biodigest</code><br>
        There is also a detailed How-To to find, which explains the exact procedure, the required method calls and all
        parameters in all details. To make it even easier, a notebook is also published that explains the use of the
        python package step by step using the examples integrated on the website.<br><br>
        <i>DIGEST is open source.</i>
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
