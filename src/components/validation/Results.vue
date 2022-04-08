<template>
  <div style="width: 100%;  padding: 16px">
    <v-sheet style="margin-top: 16px;">
      <div style="display: flex; justify-content: center" v-if="!error && result ===undefined">
        <v-subheader :class="{sh:!mobile, sh_mobile:mobile}">Status: {{
            status ? status + (status === "Queued" ? "(" + queueStats.queuePosition + "/" + queueStats.queueLength + ")" : '') : "communicating..."
          }}
        </v-subheader>
      </div>
      <div v-if="result===undefined">
        <v-progress-linear :color="error?'error':'primary'" :indeterminate="progress===undefined"
                           :value="progress"></v-progress-linear>
        <div style="width: 100%; display: flex; justify-content: center; margin-top:8px;">
          <i v-if="taskID && !result">You may return to your results later using the following URL: <a
              :href="getCurrentURL()">{{ getCurrentURL() }}</a></i>
        </div>
      </div>
      <div v-else :style="{'padding-left': isMobile() ? '16px':'64px', 'padding-right': isMobile() ? '16px': '64px'}">
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
            <div style="display:flex;">
              <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Data
              </v-subheader>
              <v-tooltip top>
                <template v-slot:activator="{attrs, on}">
                  <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                         style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 10px">
                    <v-icon>fas fa-download</v-icon>
                  </v-btn>
                </template>
                <div>Download all files as .zip</div>
              </v-tooltip>
            </div>
            <div v-if="input" style="margin-top: 32px; margin-bottom: 32px">
              <div v-if="isMobile()">
                <div style="display:flex; justify-content: center; width: 100%">
                  <div v-if="mode==='cluster'">
                    <div style=" margin:16px">
                      <b>Clusterings</b>
                      <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>{{ input.target_id }}</th>
                            <th>cluster</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tar in input.target" :key="'cluster'+tar.id">
                            <td style="margin:4px">{{ tar.id }}</td>
                            <td style="margin:4px">{{ tar.cluster }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                  </div>
                  <div v-else>
                    <div style="display:flex; justify-content: center; width: 100%">
                      <div style=" margin:16px">
                        <b>Targets</b>
                        <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>{{ input.target_id[0].toUpperCase() + input.target_id.substring(1) }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="tar in input.target" :key="'set'+tar">
                              <td style="margin:4px">{{ tar }}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
                    </div>
                    <div style="display:flex; justify-content: center; width: 100%" v-if="input.reference_id">
                      <div>
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
                              <tr v-for="ref in input.reference" :key="'ref'+ref">
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
                </div>
                <div>
                  <div style="display:flex; justify-content: center; width: 100%">
                    <div style="margin: 16px">
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
                              :key="'conf-'+param">
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
              <div v-else>
                <div style="display: flex">
                  <div style="width:50%; justify-content: center; display: flex">
                    <div v-if="mode==='cluster'">
                      <div style=" margin:16px">
                        <b>Clusterings</b>
                        <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>{{ input.target_id }}</th>
                              <th>cluster</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="tar in input.target" :key="'cluster'+tar.id">
                              <td style="margin:4px">{{ tar.id }}</td>
                              <td style="margin:4px">{{ tar.cluster }}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
                    </div>
                    <div v-else style="display: flex">
                      <div style=" margin:16px">
                        <b>Targets</b>
                        <v-simple-table dense style="max-height: 300px; overflow-y: auto;">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>{{ input.target_id[0].toUpperCase() + input.target_id.substring(1) }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="tar in input.target" :key="'set'+tar">
                              <td style="margin:4px">{{ tar }}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}" v-if="type==='gene'">
                            <v-chip outlined v-on="on" v-bind="attrs" small style="margin-top: 8px">
                              <a :href="getGProfilerUrl(input.target, input.target_id)" target="_blank">Functional
                                enrichment</a>
                              <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                            </v-chip>
                          </template>
                          <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                            genes in g:Profiler.
                          </div>
                        </v-tooltip>
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
                              <tr v-for="ref in input.reference" :key="'ref'+ref">
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
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}" v-if="getIDType(input.reference_id)==='gene'">
                            <v-chip outlined v-on="on" v-bind="attrs" small style="margin-top: 8px">
                              <a :href="getGProfilerUrl(input.reference, input.reference_id)" target="_blank">Functional
                                enrichment</a>
                              <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                            </v-chip>
                          </template>
                          <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                            genes in g:Profiler.
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; justify-content: center;">
                    <div style="margin: 16px">
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
                              :key="'conf-'+param">
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
              <div style="display: flex; justify-content: center; margin-top: 16px;">
                <v-btn @click="downloadInput()">
                  <v-icon left>fas fa-download</v-icon>
                  Download Input
                </v-btn>
              </div>
              <div style="display:flex;">
                <v-subheader style="justify-self: center; margin-left: auto; margin-top:32px; margin-right: auto">
                  External resources
                </v-subheader>
              </div>
              <v-container>
                <v-row justify="center">
                  <v-col :cols="3" style=" margin:16px" v-if="type==='gene'">
                    <b>Functional enrichment (g:Profiler)</b>
                    <v-container v-if="mode==='cluster'">
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-tooltip right>
                            <template v-slot:activator="{on, attrs}">
                              <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                                <a :href="getGProfilerUrl(input.target.map(e=>e.id))" target="_blank">All</a>
                                <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                              </v-chip>
                            </template>
                            <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                              target
                              genes in g:Profiler.
                            </div>
                          </v-tooltip>
                          <v-tooltip right v-for="cluster in getClusterNames(input.target)"
                                     :key="cluster+'_gprofiler'">
                            <template v-slot:activator="{on, attrs}">
                              <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                                <a :href="getGProfilerUrl(input.target.filter(e=>e.cluster===cluster).map(e=>e.id))"
                                   target="_blank">{{ cluster }}</a>
                                <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                              </v-chip>
                            </template>
                            <div style="width: 200px; text-align: justify">Show the functional enrichment for all
                              {{ cluster }} cluster
                              genes in g:Profiler.
                            </div>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-container v-else>
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-tooltip right>
                            <template v-slot:activator="{on, attrs}">
                              <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                                <a :href="getGProfilerUrl(input.target)" target="_blank">Targets</a>
                                <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                              </v-chip>
                            </template>
                            <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                              genes in g:Profiler.
                            </div>
                          </v-tooltip>
                          <v-tooltip right v-if="input.reference">
                            <template v-slot:activator="{on, attrs}">
                              <v-chip outlined v-on="on" v-bind="attrs" small style="margin: 4px">
                                <a :href="getGProfilerUrl(input.reference)" target="_blank">References</a>
                                <v-icon small right color="primary">fas fa-up-right-from-square</v-icon>
                              </v-chip>
                            </template>
                            <div style="width: 200px; text-align: justify">Show the functional enrichment for all target
                              genes in g:Profiler.
                            </div>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-tab-item>

          <v-tab-item style="width: 100%">
            <div style="display:flex">
              <v-subheader style="justify-self: center; margin-left: auto; margin-right: 0">Tabular results
              </v-subheader>
              <v-tooltip top>
                <template v-slot:activator="{attrs, on}">
                  <v-btn icon @click="downloadFile(getZIP('.zip'))" v-on="on" v-bind="attrs"
                         style="justify-self: flex-end; margin-left: auto; margin-right: 0; top: 12px">
                    <v-icon>fas fa-download</v-icon>
                  </v-btn>
                </template>
                <div>Download all files as .zip</div>
              </v-tooltip>
            </div>
            <div :style="{display: isMobile() ? '':'flex'}">
              <div
                  :style="{width: isMobile()?'100%':'50%', 'align-self': 'center', 'margin-top': 'auto', 'margin-bottom': 'auto', 'padding-top':'16px', 'padding-bottom': '16px'}">
                <div style=" justify-content: center; display: flex">
                  <div>
                    <b>Empirical P-values</b>
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
                            <th class="text-left" v-for="head in Object.keys(result.p_values.values)"
                                :key="'p_value-head'+head">
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
                          <tr v-for="metric in Object.keys(Object.values(result.p_values.values)[0])" :key="metric">
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
                            <td v-for="head in Object.keys(result.p_values.values)" :key="'p_value-'+head"
                                style="margin:4px">{{ formatValue(result.p_values.values[head][metric]) }}
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </div>
                    <div v-else>
                      <div>
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
                                <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                                     @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
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
                              <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6)">
                                <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                                  {{ metric }}
                                  <v-tooltip right>
                                    <template v-slot:activator="{attrs, on}">
                                      <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                                    </template>
                                    <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                                  </v-tooltip>
                                </div>
                              </b></td>
                              <td :style="{margin: mobile ? '1px':'4px', padding: mobile ? '0 1px' :''}"
                                  v-for="head in Object.keys(result.p_values.values)"
                                  :key="metric+head">
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
                </div>
              </div>
              <div
                  :style="{width: isMobile()? '100%' :'50%', 'align-self': 'center', 'margin-top': 'auto', 'margin-bottom': 'auto', 'padding-top':'16px', 'padding-bottom': '16px'}">
                <div style=" justify-content: center; display: flex">
                  <div>
                    <b>{{ getScoreName() }}</b>
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
                            <th class="text-left" v-for="head in Object.keys(result.input_values.values)"
                                :key="'input_'+head">
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
                            </b>
                            <td v-for="head in Object.keys(result.input_values.values)" :key="'input_value-'+head"
                                style="margin:4px">{{ formatValue(result.input_values.values[head][metric]) }}
                            </td>
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
                                <div :style="{'white-space': mobile ? '': 'nowrap', cursor: 'pointer'}"
                                     @click="clusterMeasure=head; clusterMeasureIdx=Object.keys(result.input_values.values).indexOf(head)">
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
                            <tr v-for="metric in Object.keys(Object.values(result.input_values.values)[0])"
                                :key="metric">
                              <td :style="{margin: mobile ? '1px':'4px'}"><b style="color: rgba(0,0,0,0.6)">
                                <div :style="{'white-space': mobile ? '' : 'nowrap'}">
                                  {{ metric }}
                                  <v-tooltip right>
                                    <template v-slot:activator="{attrs, on}">
                                      <v-icon small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                                    </template>
                                    <div style="width:200px; text-align: justify">{{ tooltips[metric] }}</div>
                                  </v-tooltip>
                                </div>
                              </b></td>
                              <td :style="{margin: mobile ? '1px':'4px', padding: mobile ? '0 1px' :''}"
                                  v-for="head in Object.keys(result.input_values.values)"
                                  :key="metric+head">
                                <b style="color: cornflowerblue; " v-show="head===clusterMeasure">{{
                                    formatValue(result.input_values.values[head][metric])
                                  }}</b>
                                <span v-show="head !== clusterMeasure">{{
                                    formatValue(result.input_values.values[head][metric])
                                  }}</span>
                                <!--                                {{ formatValue(result.input_values.values[head][metric]) }}-->
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <v-divider></v-divider>
            <div style="display: flex; justify-content: center">
              <v-subheader>Summary figures</v-subheader>
            </div>
            <template v-if="plots">
              <div v-if="isMobile()">
                <template v-if="mode!=='cluster'">
                  <v-container>
                    <v-col>
                      <v-row justify="center">
                        <!--                        <div style="width: 100%; display: flex; justify-content: center">-->
                        <v-img :src="getPlot('p-value')" contain
                               style="position: relative">
                          <v-btn icon small style="position: absolute; right: 0"
                                 @click="downloadFile(getPlot('p-value'))">
                            <v-icon small>fas fa-download</v-icon>
                          </v-btn>
                        </v-img>
                        <!--                      </div>-->
                      </v-row>
                      <v-row>
                        <!--                        <div style="width: 100%; display: flex; justify-content: center">-->
                        <v-img :src="getPlot('mappability')" contain
                               style="position: relative">
                          <v-btn icon small style="position: absolute; right: 0"
                                 @click="downloadFile(getPlot('mappability'))">
                            <v-icon small>fas fa-download</v-icon>
                          </v-btn>
                        </v-img>
                        <!--                        </div>-->
                      </v-row>
                    </v-col>
                  </v-container>
                </template>
                <template v-else>
                  <v-container>
                    <v-col>
                      <v-row justify="center">
                        <v-container>
                          <v-col>
                            <v-row>
                              <v-tabs vertical v-model="clusterMeasureIdx">
                                <v-tab v-for="measure in measureMap['clustering']" @click="clusterMeasure=measure;"
                                       :key="measure+'_p-value_plots'">
                                  {{ measure }}
                                  <v-tooltip right>
                                    <template v-slot:activator="{attrs, on}">
                                      <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                                    </template>
                                    <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                                  </v-tooltip>
                                </v-tab>
                              </v-tabs>
                            </v-row>
                          </v-col>
                          <v-col>
                            <v-row>
                              <v-img :src="getPlot(clusterMeasure+'_p-value')" contain
                                     style="position: relative">
                                <v-btn icon small style="position: absolute; right: 0"
                                       @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                                  <v-icon small>fas fa-download</v-icon>
                                </v-btn>
                              </v-img>
                            </v-row>
                          </v-col>
                        </v-container>
                      </v-row>
                      <v-row justify="center">
                        <v-img :src="getPlot('mappability')" contain
                               style="margin:32px; position: relative">
                          <v-btn icon small style="position: absolute; right: 0"
                                 @click="downloadFile(getPlot('mappability'))">
                            <v-icon small>fas fa-download</v-icon>
                          </v-btn>
                        </v-img>
                      </v-row>
                    </v-col>
                  </v-container>
                </template>
              </div>
              <div v-else>
                <div style="display: flex; justify-content: center" v-if="mode!=='cluster'">
                  <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                    <v-img :src="getPlot('p-value')" height="35vh" contain
                           style="margin:32px; position: relative">
                      <v-btn icon small style="position: absolute; right: 0" @click="downloadFile(getPlot('p-value'))">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                  <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                    <v-img :src="getPlot('mappability')" height="35vh" contain
                           style="margin:32px; position: relative">
                      <v-btn icon small style="position: absolute; right: 0"
                             @click="downloadFile(getPlot('mappability'))">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                </div>
                <div v-else style="display: flex">
                  <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                    <div style="display: flex; margin-top:32px;">
                      <v-tabs vertical v-model="clusterMeasureIdx">
                        <v-tab v-for="measure in measureMap['clustering']" @click="clusterMeasure=measure;"
                               :key="measure+'_p-value_plots'">
                          {{ measure }}
                          <v-tooltip right>
                            <template v-slot:activator="{attrs, on}">
                              <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                            </template>
                            <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                          </v-tooltip>
                        </v-tab>
                      </v-tabs>
                      <v-img :src="getPlot(clusterMeasure+'_p-value')" height="35vh" contain
                             style="margin-left:32px; margin-bottom:32px; position: relative">
                        <v-btn icon small style="position: absolute; right: 0"
                               @click="downloadFile(getPlot(clusterMeasure+'_p-value'))">
                          <v-icon small>fas fa-download</v-icon>
                        </v-btn>
                      </v-img>
                    </div>
                  </div>
                  <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                    <v-img :src="getPlot('mappability')" height="35vh" contain
                           style="margin:32px; position: relative">
                      <v-btn icon small style="position: absolute; right: 0"
                             @click="downloadFile(getPlot('mappability'))">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                </div>
              </div>
              <div style="display: flex; justify-content: center">
                <v-subheader>Extended summary figures</v-subheader>
              </div>
              <div id="plots2" style="display: flex; justify-content: center">
                <div style="align-self: flex-start; margin-right: auto; margin-left: 0; width: 40%">
                  <div style="display: flex; margin-top:32px;">
                    <v-tabs vertical>
                      <v-tab v-for="measure in termMap[mode]" @click="distributionMeasure=measure;"
                             :key="measure+'_distribution_plots'">
                        {{ measure }}
                        <v-tooltip right>
                          <template v-slot:activator="{attrs, on}">
                            <v-icon right small v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width:200px; text-align: justify">{{ tooltips[measure] }}</div>
                        </v-tooltip>
                      </v-tab>
                    </v-tabs>
                    <v-img :src="getPlot(getDistPlotName())" height="35vh" contain
                           style="margin-left:32px; margin-bottom:32px; position: relative">
                      <v-btn icon small style="position: absolute; right: 0"
                             @click="downloadFile(getDistPlotName())">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-img>
                  </div>
                </div>
                <div style="align-self: flex-end; margin-right: 0; margin-left: auto; width: 40%">
                  <v-img :src="getPlot('sankey')" height="35vh" contain
                         style="margin:32px; position: relative">
                    <v-btn icon small style="position: absolute; right: 0"
                           @click="downloadFile(getPlot('sankey'))">
                      <v-icon small>fas fa-download</v-icon>
                    </v-btn>
                  </v-img>
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
    idMap: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
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
      zips: undefined,
      progress: undefined,
      input: undefined,
      clusterMeasure: 'DI-based',
      clusterMeasureIdx: 0,
      measureMap: {
        'clustering': ['DI-based', 'SS-based', 'DBI-based'],
      },
      termMap: {
        'cluster': ['GO.BP', 'GO.CC', 'GO.MF', 'KEGG'],
        'set': ['KEGG', 'JI-based', 'OC-based']
      },
      distributionMeasure: "",
      tooltips: {
        'DI-based': "Dunn Index: ratio of the cluster with the lowest density compared to the two clusters that are closest to each other.",
        'SS-based': "Silhouette Score: measures how well an observation is clustered and it estimates the average distance between clusters.",
        'DBI-based': "Davies Bouldin Index: measures how dense clusters are iin comparison to distances between each cluster pair.",
        p_values: "Empirical P-value calculated on input score(s) with respect to chosen background model.",
        set_value: "Calculated input score based on functional or genetic coherence.",
        'GO.BP': "based on functional coherence of biological process annotations from Gene Ontology (GO).",
        'GO.CC': "based on functional coherence of cell component annotations from Gene Ontology (GO).",
        'GO.MF': "based on functional coherence of molecular function annotations process from Gene Ontology (GO).",
        'KEGG': "based on functional coherence of pathways annotations from Kyoto Encyclopedia of Genes and Genomes (KEGG)",
        'JI-based': "Jaccard Index based: calculated by the intersection of two sets divided by the union of both.",
        'OC-based': "Overlap Coefficient based: calculated by the intersection of two sets divided by the size of the smaller set."
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
    this.distributionMeasure = this.termMap[this.mode][0]
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
    printVar: function (value) {
      console.log(value)
    },
    getClusterNames: function (clustering) {
      const uniq = []
      clustering.map(e => e.cluster).forEach(e => {
        if (uniq.indexOf(e) === -1)
          uniq.push(e)
      })
      return uniq
    },

    getGProfilerUrl: function (list) {
      const queryString = list.join('%0A');
      const url = 'http://biit.cs.ut.ee/gprofiler/gost?' +
          'organism=hsapiens&' +
          `query=${queryString}&` +
          'ordered=false&' +
          'all_results=false&' +
          'no_iea=false&' +
          'combined=false&' +
          'measure_underrepresentation=false&' +
          'domain_scope=annotated&' +
          'significance_threshold_method=g_SCS&' +
          'user_threshold=0.05&' +
          'sources=GO:MF,GO:CC,GO:BP,KEGG,TF,REAC,MIRNA,HPA,CORUM,HP,WP'
      return url
    },

    loadPlots: function () {
      this.$http.getResultFiles(this.taskID).then(files => {
        this.plots = files.filter(file => file.type === 'png').map(file => this.getFilePath(file.name))
        this.csvs = files.filter(file => file.type === 'csv').map(file => this.getFilePath(file.name))
        this.zips = files.filter(file => file.type === 'zip').map(file => this.getFilePath(file.name))
      }).catch(console.error)
    },

    getIDType: function (id) {
      for (let idType of Object.keys(this.idMap)) {
        if (this.idMap[idType].map(e => e.value).includes(id)) {
          return idType
        }
      }
      return undefined
    },
    downloadInput: function () {
      this.download('digest_' + this.taskID + "_input.json", JSON.stringify(this.input))
    },
    isMobile: function () {
      return this.mobile
    },

    getDistPlotName: function () {
      if (this.mode === "cluster")
        return this.clusterMeasure + "-" + this.distributionMeasure + "_distribution"
      return this.distributionMeasure + "_distribution"
    },
    download: function (name, content) {
      let dl = document.createElement('a')
      dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      dl.setAttribute('download', name)
      dl.style.direction = 'none'
      document.body.appendChild(dl)
      dl.click()
      document.body.removeChild(dl)
    },

    getScoreName: function () {
      if (this.mode === 'set-set') {
        let ref_type = this.getIDType(this.input.reference_id)
        if (this.type === 'gene' || ref_type === 'gene') {
          return 'Functional relevance score'
        }
        return 'Functional relevance score & genetic relevance score'
      } else {
        return this.type === 'gene' ? 'Functional relevance score' : 'Genetic relevance score'
      }
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
        if (response.progress)
          this.progress = response.progress * 100
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
        let decimals = this.isMobile() ? 4 : 6;
        return s.length > (decimals + 2) ? s.substring(0, Math.max(decimals + 2, idx)) : s
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

    getZIP: function (name) {
      return this.zips.filter(zip => zip.includes(name))[0]
    },

    getPlot: function (name) {
      let url = this.plots.filter(plot => plot.includes(name))[0]
      if (url)
        return url
      return "https://www.schulz-grafik.de/wp-content/uploads/2018/03/placeholder.png"
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

.sh_mobile
  font-size: 1.2rem

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.margin_mobile
  padding-left: 8px
  padding-right: 8px

</style>