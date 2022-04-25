<template>
  <div style="width: 100%;  padding: 16px">
    <div v-if="isMobile()" style="display: flex; margin-bottom: 16px">
      <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">
        <v-icon left>fas fa-angle-left</v-icon>
        Back
      </v-btn>
      <v-btn color="primary" @click="checkEvent" style="margin-left: auto; margin-right: 0; justify-self: flex-end">
        Validate
        <v-icon right>fas fa-angle-right</v-icon>
      </v-btn>
    </div>
    <div v-bind:class="{flex:!mobile}">
      <v-btn v-if="!mobile" color="error" @click="$emit('resetEvent')"
             style="justify-self: flex-start; margin-right: auto;">
        <v-icon left>fas fa-angle-left</v-icon>
        Back
      </v-btn>
      <div v-if="(mode==='set' || mode ==='network') && type==='gene'"
           :class="{flex_self_center:!mobile, example_div_width:mobile}">
        <v-btn color="primary" :class="{flex_self_center:mobile}" outlined @click="loadExample(mode, 'gene', mode)">
          <v-icon left>far fa-lightbulb</v-icon>
          Set only Example
        </v-btn>
      </div>
      <div v-if="(mode==='set' || mode ==='network') && type==='gene'"
           :class="{flex_self_center:!mobile, example_div_width:mobile}">
        <v-btn color="primary" :class="{flex_self_center:mobile}" outlined @click="loadExample(mode, 'gene', 'ref')">
          <v-icon left>far fa-lightbulb</v-icon>
          Reference Example
        </v-btn>
      </div>
      <div v-if="mode==='cluster' && type==='gene'" :class="{flex_self_center:!mobile, example_div_width:mobile}">
        <v-btn color="primary" :class="{flex_self_center:mobile}" outlined
               @click="loadExample('cluster', 'gene')">
          <v-icon left>far fa-lightbulb</v-icon>
          Example
        </v-btn>
      </div>
      <div v-if="mode==='cluster' && type==='disease'" :class="{flex_self_center:!mobile, example_div_width:mobile}">
        <v-btn color="primary" :class="{flex_self_center:mobile}"
               outlined
               @click="loadExample('cluster', 'disease')">
          <v-icon left>far fa-lightbulb</v-icon>
          Example
        </v-btn>
      </div>
      <div v-if="(mode==='set' || mode ==='network') && type==='disease'"
           :class="{flex_self_center:!mobile, example_div_width:mobile}">
        <v-btn color="primary" outlined :class="{flex_self_center:mobile}"
               @click="loadExample('set', 'disease')">
          <v-icon left>far fa-lightbulb</v-icon>
          Example
        </v-btn>
      </div>
      <v-btn v-if="!isMobile()" color="primary" @click="checkEvent"
             style="margin-left: auto; margin-right: 0; justify-self: flex-end">
        Validate
        <v-icon right>fas fa-angle-right</v-icon>
      </v-btn>
    </div>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader :class="{sh_mobile:mobile, sh:!mobile}">
          {{ mode === 'network' ? "Nodes of induced subnetwork" : "Targets" }}
        </v-subheader>
      </div>
      <v-alert v-if="errorTargetID" type="error" dense>Missing target ID type selection</v-alert>
      <v-alert v-if="errorTargetIDs" type="error" dense>Missing targetIDs</v-alert>
      <v-container :class="{border_mobile:mobile, border:!mobile}">
        <v-row justify="center">
          <v-col cols="12" lg="4" :class="{'flex_content_center':mobile}">
            <v-container style="padding-top: 16px">
              <v-row justify="center" justify-lg="start">
                <v-col cols="12" md="6" lg="12" class="flex_content_center">
                  <v-select :label="mode==='network' ?'Node ID type':'Target ID type'" :items="targetIDTypes[type]"
                            v-model="targetIDType"
                            style="max-width: 210px; min-width: 210px" outlined dense filled hide-details>
                    <template v-slot:append-outer>
                      <v-tooltip right>
                        <template v-slot:activator="{on, attrs}">
                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width: 250px; text-align: justify">
                          ID type of inserted {{ mode === 'network' ? 'node' : 'target' }} IDs. Click on the drop-down
                          to see the supported types.
                        </div>
                      </v-tooltip>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" lg="12" class="flex_content_center">
                  <v-file-input ref="tarInput" :label="'Upload '+(mode==='network' ? 'nodes' : 'targets')"
                                hide-details
                                dense
                                single-line
                                style="width: 210px; max-width: 210px; cursor: pointer"
                                v-model="targetFile" @change="readTargetFile" prepend-icon="" filled outlined
                                prepend-inner-icon="fas fa-arrow-up-from-bracket">
                    <template v-slot:append-outer>
                      <v-tooltip right>
                        <template v-slot:activator="{on, attrs}">
                          <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                        </template>
                        <div style="width: 250px; text-align: justify" v-if="mode !== 'network'">
                          Upload of file with target IDs that are separated by a newline in the file.
                        </div>
                        <div style="width: 250px; text-align: justify" v-if="mode === 'network'">
                          Upload a single column node list, edge list or .sif network file with node IDs.
                        </div>
                      </v-tooltip>
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col cols="12" lg="8" :class="{'flex_content_center':mobile}">
            <v-textarea v-if="mode==='set' || mode==='network'" :label="mode==='network' ? 'Node IDs' : 'Target IDs'"
                        v-model="targets"
                        :class="{ 'ta_mobile':mobile }"
                        no-resize
                        filled
                        placeholder="Enter your chosen IDs newline separated...">
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon style="top: -14px;right:-10px; margin-left: -21px" v-bind="attrs" v-on="on">far
                      fa-question-circle
                    </v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Manually add IDs newline separated. After inserting IDs manually or with a file upload, IDs can be
                    changed or deleted as desired.
                  </div>
                </v-tooltip>
              </template>
            </v-textarea>
            <v-data-table v-if="mode==='cluster'" item-key="id" :items="clusters" :class="{ 'ta_mobile':mobile }"
                          style="padding: 16px; margin-left: 0; margin-right: 0; justify-self: flex-end" dense
                          :headers="clusterHeaders">
              <template v-slot:item.action="{item}">
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn icon v-on="on" v-bind="attrs" @click="removeClusterEntry(item)" small>
                      <v-icon>far fa-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <div style="width: 200px; text-align: justify">
                    Remove entry from cluster list!
                  </div>
                </v-tooltip>
              </template>
              <template v-slot:body.append="{headers}">
                <tr>
                  <td :style="{'text-align':headers[0].align}">
                    <v-text-field dense label="id" style="margin-bottom: -16px; margin-top:16px;padding-bottom: 6px"
                                  v-model="clusterIDModel">
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Insert ID of target ID type.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </td>
                  <td :style="{'text-align':headers[1].align}">
                    <v-text-field dense label="cluster"
                                  style="margin-bottom: -16px; margin-top:16px; padding-bottom: 6px"
                                  v-model="clusterModel">
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Add assigned Cluster. Names and/or numbers are supported.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </td>
                  <td :style="{'text-align':headers[2].align, 'width':headers[2].width}">
                    <v-tooltip right>
                      <template v-slot:activator="{attrs, on}">
                        <v-btn v-on="on" v-bind="attrs" icon @click="addClusterEntry()" small>
                          <v-icon>far fa-square-plus</v-icon>
                        </v-btn>
                      </template>
                      <div style="width: 200px; text-align: justify">
                        Add custom entry to cluster list!
                      </div>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <template v-if="mode==='set' || mode ==='network'">
        <div style="display: flex; justify-content: center;">
          <v-subheader :class="{sh_mobile:mobile, sh:!mobile}">References (optional)</v-subheader>
        </div>
        <v-alert v-if="errorReferenceID" type="error" dense>Missing reference ID type selection</v-alert>
        <v-alert v-if="errorReferenceIDs" type="error" dense>Missing reference IDs</v-alert>
        <v-container :class="{border_mobile:mobile, border:!mobile}">
          <v-row justify="center" justify-lg="start">
            <v-col cols="12" lg="4" class="flex_content_center">
              <div style="padding-top: 16px">
                <v-checkbox v-model="useReference" label="Use reference"
                            style="max-width: 170px" hide-details>
                  <template v-slot:append>
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                      </template>
                      <div style="width: 250px; text-align: justify">
                        Set checkmark if the input target set should be compared to a reference.
                      </div>
                    </v-tooltip>
                  </template>
                </v-checkbox>
              </div>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" lg="4" :class="{'flex_content_center':mobile}">
              <v-container>
                <v-row justify="center" justify-lg="start">
                  <v-col cols="12" md="6" lg="12" class="flex_content_center">
                    <v-select v-if="type==='gene'" outlined :disabled="!useReference" filled label="Reference type"
                              :items="refTypes" v-model="refType" hide-details @change="(val)=>{ if(val ==='disease') this.enriched=false}"
                              style="max-width: 180px;" :class="{'flex_self_center':mobile}" dense>
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            ID type of inserted reference IDs. Click on the drop-down to see the supported types.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-select>
                    <v-select v-else outlined :disabled="!useReference" filled label="Reference type"
                              :items="[{text:'Disease',value:'disease'}]" v-model="refType" hide-details
                              style="max-width: 180px" :class="{'flex_self_center':mobile}" dense>
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Select if the reference consists of gene or disease IDs.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6" lg="12" class="flex_content_center">
                    <v-select outlined :disabled="!useReference" filled label="Reference ID type"
                              :items="targetIDTypes[refType]" hide-details
                              v-model="referenceIDType" style="max-width: 220px" :class="{'flex_self_center':mobile}"
                              dense>
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            ID type of inserted reference IDs. Click on the drop-down to see the supported types.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6" lg="12" class="flex_content_center">
                    <v-file-input ref="refInput" :disabled="!useReference" label="Upload references"
                                  hint="Upload a file of newline separated reference IDs"
                                  :class="{'flex_self_center':mobile}" dense hide-details
                                  style="width: 270px; max-width: 270px; cursor: pointer"
                                  v-model="referenceFile" @change="readReferenceFile" prepend-icon="" filled outlined
                                  prepend-inner-icon="fas fa-arrow-up-from-bracket">
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Upload of file with reference IDs that are separated by a newline in the file.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" lg="8" :class="{'flex_content_center':mobile}">
              <v-textarea :disabled="!useReference" label="Reference IDs" filled :class="{ 'ta_mobile':mobile }"
                          placeholder="Enter your chosen IDs newline separated..." v-model="references" no-resize>
                <template v-slot:append>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon style="top: -14px;right:-10px; margin-left: -21px" v-bind="attrs" v-on="on">far
                        fa-question-circle
                      </v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Manually add reference IDs newline separated. After inserting IDs manually or with a file
                      upload,
                      IDs
                      can be changed or deleted as desired.
                    </div>
                  </v-tooltip>
                </template>
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
      </template>
      <template v-if="mode === 'network'">
        <div style="display: flex; justify-content: center">
<!--          <v-subheader :class="{sh_mobile:mobile, sh:!mobile}">Custom Network (optional)</v-subheader>-->
          <v-subheader :class="{sh_mobile:mobile, sh:!mobile}">Custom Network</v-subheader>
        </div>
        <v-alert v-if="errorNetwork" type="error" dense>Please upload a valid network!</v-alert>
        <v-alert v-if="errorNetworkFormat" type="error" dense>Network format is not of accepted type (.sif, .gt,
          .graphml)!
        </v-alert>
        <v-alert v-if="errorNetworkIDType" type="error" dense>Missing node id type definition!</v-alert>
        <v-alert v-if="errorNetworkNodeName" type="error" dense>Missing node attribute name!</v-alert>
        <v-container style="margin-bottom: 32px">
          <v-row justify="center">
            <v-col cols="12" :lg="6" :md="8" :sm="10" class="flex_content_center">
              <v-file-input ref="networkInput" label="Network"
                            dense
                            single-line
                            show-size
                            style="width: 210px; max-width: 80% ;  cursor: pointer"
                            accept=".sif,.graphml,.gt" :rules="networkRule"
                            v-model="networkFile" prepend-icon="fas fa-arrow-up-from-bracket" filled outlined
                            prepend-inner-icon="">
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="max-width: 300px">
                      Upload a network with {{ type }} nodes in sif, gt or graphml format. If the given network is of
                      type graphml or gt, the name of the vertex property where the IDs are stored is needed.
                    </div>
                  </v-tooltip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" sm="5" class="flex_content_center">
              <v-select outlined :disabled="!networkFile" filled label="Network node type"
                        :items="idMap[type]" v-model="nodeType" hide-details
                        style="max-width: 220px" :class="{'flex_self_center':mobile}" dense>
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Select the ID space the {{ type }} nodes in your selected background network are in.
                    </div>
                  </v-tooltip>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="5" class="flex_content_center">
              <v-text-field style="max-width: 220px" outlined filled dense v-model="nodeName"
                            :disabled="!networkFile || !(networkFile.name.endsWith('.gt') || networkFile.name.endsWith('.graphml'))"
                            label="Property name">
                <template v-slot:append-outer>
                  <v-tooltip right>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                    </template>
                    <div style="width: 250px; text-align: justify">
                      Define the node or prop name of the {{ type }} nodes where the ID is located.
                    </div>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
      </template>
      <div style="display: flex; justify-content: center">
        <v-subheader :class="{sh_mobile:mobile, sh:!mobile}">Additional parameters (optional)</v-subheader>
      </div>
      <v-container :class="{border_mobile:mobile, border:!mobile}">
        <v-row justify="center">
          <v-col cols="4" md="12">
            <div style="padding-top: 16px">
              <v-container style="margin-top: 16px">
                <v-row justify="center" justify-md="start">
                  <v-col class="flex_content_center" cols="12" lg="4" md="6" v-if="mode==='set' || mode==='network'">
                    <v-checkbox
                        style="margin-top: 4px; max-width: 140px;"
                        :disabled="!useReference || refType === 'disease'"
                        v-model="enriched"
                        hide-details
                        label="Enriched">
                      <template v-slot:append>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 250px; text-align: justify">
                            Set checkmark, if only enriched annotations of the reference set should be used.
                          </div>
                        </v-tooltip>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col class="flex_content_center" cols="12" :md="mode==='set' || mode==='network'?6:12"
                         :lg="mode==='set' || mode==='network'?4:6">
                    <v-select label="Similarity measure" :items="distanceMeasures" v-model="distanceModel"
                              style="max-width: 240px; min-width: 240px;" hide-details
                              outlined dense filled>
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 400px;">
                            <div style="display: flex">
                              <div style="width: 40%">
                                Jaccard index:
                              </div>
                              <div style="width: 60%; text-align: justify">
                                defined as the size of the intersection divided by the size of the union of the sets
                              </div>
                            </div>
                            <div style="display: flex; margin-top: 8px;">
                              <div style="width: 40%">
                                Overlap coefficient:
                              </div>
                              <div style="width: 60%; text-align: justify">
                                defined as the size of the intersection divided by the size of the smaller of the two
                                sets
                              </div>
                            </div>
                          </div>
                        </v-tooltip>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col class="flex_content_center" cols="12" md="12" :lg="mode==='set' || mode==='network'?4:6">
                    <v-select label="Background model"
                              :items="getBackgroundModelItems()"
                              v-model="backgroundModel"
                              hide-details
                              style="max-width: 260px; min-width: 250px;" outlined dense filled>
                      <template v-slot:append-outer>
                        <v-tooltip right>
                          <template v-slot:activator="{on, attrs}">
                            <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                          </template>
                          <div style="width: 400px;">
                            <div style="display: flex"
                                 v-if="getBackgroundModelItems().map(e=>e.value).indexOf('complete')>-1">
                              <div style="width: 40%">
                                Fully randomized:
                              </div>
                              <div style="width: 60%; text-align: justify">
                                Model draws {{ type }} uniformly without replacement to compute fully randomized {{
                                  type
                                }}
                                sets
                                of
                                target set
                                size.
                              </div>
                            </div>
                            <div style="display: flex; margin-top: 8px;"
                                 v-if="getBackgroundModelItems().map(e=>e.value).indexOf('term-pres')>-1">
                              <div style="width: 40%">
                                Term-size preserving:
                              </div>
                              <div style="width: 60%; text-align: justify">
                                Model maintains some information from target set and constructs randomized {{ type }}
                                sets
                                where
                                the
                                distribution of the contained {{ type }}s' annotation set sizes (approximately) matches
                                the
                                distribution
                                of the annotation set sizes of the {{ type }} contained in target set.
                              </div>
                            </div>
                            <div style="display: flex; margin-top: 8px;"
                                 v-if="getBackgroundModelItems().map(e=>e.value).indexOf('network')>-1">
                              <div style="width: 40%">
                                Network-based:
                              </div>
                              <div style="width: 60%; text-align: justify">
                                New random subnetworks are determined, while preserving information from the original
                                input. Here, the connected components are identified from the input {{ type }}s within
                                the
                                user given or default network and then random nodes with the same number and size of
                                connected components are selected.
                              </div>
                            </div>
                          </div>
                        </v-tooltip>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <v-slider label="Runs" min="100" max="10000" step="100" v-model="runs" dense>
              <template v-slot:prepend>
                <v-text-field v-model="runs" single-line type="number"
                              style="max-width: 5rem; margin-top: -16px"></v-text-field>
              </template>
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Number of runs to be performed with randomly generated target IDs to be used as a comparison for the
                    determination of the empirical p-value
                  </div>
                </v-tooltip>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <v-slider label="Replace" min="1" max="100" step="1" v-model="replace" dense>
              <template v-slot:prepend>
                <v-text-field v-model="replace" single-line type="number"
                              style="max-width: 5rem; margin-top: -16px"></v-text-field>
              </template>
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    How many percent of the target set elements should be replaced each run with random values based on
                    the
                    background model.
                  </div>
                </v-tooltip>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <div style="display: flex; margin-top:8px">
        <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">
          <v-icon left>fas fa-angle-left</v-icon>
          Back
        </v-btn>

        <v-btn color="primary" @click="checkEvent"
               style="margin-left: auto; margin-right: 0; justify-self: flex-end">
          Validate
          <v-icon right>fas fa-angle-right</v-icon>
        </v-btn>
      </div>
    </v-sheet>
    <v-snackbar v-model="notification.show" :multi-line="true" :timeout="notification.timeout"
                color="warning" dark>
      {{ notification.message }}
    </v-snackbar>
  </div>
</template>

<script>

import * as EXAMPLES from "../../Example"

export default {
  name: "Configuration",

  props: {
    mode: String,
    type: String,
    idMap: Object,
    mobile: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      notification: {
        show: false,
        message: "",
        timeout: 5000,
      },
      targetFile: undefined,
      referenceFile: undefined,
      errorNetwork:false,
      errorTargetID: false,
      errorTargetIDs: false,
      errorReferenceID: false, width: "50px",
      errorReferenceIDs: false,
      errorNetworkFormat: false,
      errorNetworkIDType: false,
      errorNetworkNodeName: false,
      clusterIDModel: "",
      clusterModel: "",
      edgeID1Model: "",
      edgeID2Model: "",
      edgeNameModel: "",
      targetIDType: undefined,
      networkFile: undefined,
      targets: "",
      references: "",
      reference: "",
      referenceIDType: undefined,
      useReference: false,
      enriched: false,
      runs: 1000,
      replace: 100,
      distanceModel: "jaccard",
      refType: "disease",
      nodeType: "",
      nodeName: "",
      clusterHeaders: [
        {text: 'Target ID', align: 'start', sortable: true, value: 'id'},
        {text: 'Cluster', align: 'start', sortable: true, value: 'cluster'},
        {text: 'Action', align: 'end', sortable: false, width: "50px", value: 'action'}
      ],
      clusters: [],
      edges: [],
      networkRule: [
        value => !value || (value.name.endsWith('.gt') || value.name.endsWith('.graphml') || value.name.endsWith('.sif')) || 'Network file must have the suffix .sif, .gt or .graphml.'
      ],
      refTypes: [
        {text: "Gene", value: "gene"},
        {text: "Disease", value: "disease"},
      ],
      distanceMeasures: [
        {text: "Jaccard index", value: "jaccard"},
        {text: "Overlap coefficient", value: "overlap"}
      ],
      backgroundModel: this.mode === 'cluster' ? 'complete' : (this.mode === 'network' ? 'network' : "complete"),
      backgroundModels: [
        {text: "Fully randomized", value: "complete"},
        {text: "Term-size preserving", value: "term-pres"},
        {text: "Network-based", value: "network"}
      ],
      targetIDTypes: this.idMap
    }
  },

  created() {
    this.$router.push("/configure")
  },

  methods: {

    idsToList: function (ids) {
      return ids.split(/\n/).filter(id => id.length > 0)
    },

    readTargetFile: function (file) {
      if (file) {
        if (this.mode === 'network') {
          this.readEdges(file)
        } else {
          this.readFile(file, 'target')
        }
        this.$refs.tarInput.blur()
      }
    },

    readReferenceFile: function (file) {
      if (file) {
        this.readFile(file, 'reference')
        this.$refs.refInput.blur()
      }
    },

    isMobile: function () {
      return this.mobile
    },
    limitColumns: function (content, delim, columns) {
      return content.split("\n").map(line => {
        if (line.length === 0)
          return ""
        let entries = line.split(delim);
        let l = ""
        for (let e = 0; e < columns; e++)
          l += entries[e] + delim;
        l = l.substring(0, l.length - delim.length)
        return l
      }).filter(l => l.length > 0).join("\n")
    },

    readFileContent: function (result, goal) {
      if (goal === 'target') {
        if (this.mode === 'cluster') {
          result = this.limitColumns(result, "\t", 2)
          result.split("\n").forEach(l => {
            let entries = l.split("\t");
            this.addToClusters(entries[0], entries[1]);
          })
        } else {
          result = this.limitColumns(result, "\t", 1)
          this.targets = result
        }
        this.targetFile = undefined
      }
      if (goal === 'reference') {
        this.references = result
        this.referenceFile = undefined
      }
    },

    readEdgeListContent: function (result, sif) {
      this.targets = []
      let lines = result.split("\n").filter(l => l && l.length > 0).map(l => l.split(/\s*[\s,]\s*/))
      if (sif) {
        lines.forEach(entries => {
          if (entries.length > 2)
            for (let i = 2; i < entries.length; i++) {
              this.addToEdges(entries[0], entries[i])
            }
          else if (entries.length === 1) {
            this.addToEdges(entries[0])
          } else
            this.addToEdges(entries[0], entries[1])
        })
      } else {
        lines.forEach(entries => {
          this.addToEdges(entries[0], entries[1]);
        })
      }
      this.targets = this.targets.join("\n")
      this.targetFile = undefined
    }
    ,

    readFile: function (file, goal) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result
        this.readFileContent(atob(result.split('base64,')[1]), goal)
      });
      reader.readAsDataURL(file);
    }
    ,

    readEdges: function (file) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result
        this.readEdgeListContent(atob(result.split('base64,')[1]), file.name.endsWith(".sif"))
      });
      reader.readAsDataURL(file);
    }
    ,

    removeClusterEntry: function (item) {
      this.clusters.splice(this.clusters.indexOf(item), 1)
    }
    ,
    addClusterEntry: function () {
      if (this.clusterModel && this.clusterIDModel && this.clusterModel.length > 0 && this.clusterIDModel.length > 0) {
        this.addToClusters(this.clusterIDModel, this.clusterModel)
        this.clusterModel = ""
        this.clusterIDModel = ""
      }
    }
    ,
    addToClusters: function (id, cluster) {
      let clusterItem = {id: id, cluster: cluster}
      if (this.clusters.indexOf(clusterItem) > -1) {
        this.setNotification("This entry already exists!")
      } else {
        if (this.clusters.map(i => i.id).indexOf(id) > -1) {
          this.setNotification("Duplicate IDs are not allowed!")
        } else
          this.clusters.push(clusterItem)
      }
    }
    ,

    addTarget: function (entry) {
      if (this.targets.indexOf(entry) === -1)
        this.targets.push(entry)
    },
    addToEdges: function (id1, id2) {
      if (id1)
        this.addTarget(id1)
      if (id2)
        this.addTarget(id2)
    }
    ,
    setNotification: function (message, timeout) {
      if (timeout)
        this.notification.timeout = timeout
      if (message)
        this.notification.message = message
      this.notification.show = true
    }
    ,
    loadExample: function (mode, type, example) {
      if (mode === 'set') {
        if (type === 'gene') {
          if (example === 'set') {
            this.readFileContent(EXAMPLES.gene_set.target, 'target')
            this.targetIDType = EXAMPLES.gene_set.target_id_type
            this.useReference = false
            this.enriched = false
            this.backgroundModel = 'complete'
            this.references = ""
          }
          if (example === 'ref') {
            this.readFileContent(EXAMPLES.gene_set.target, 'target')
            this.targetIDType = EXAMPLES.gene_set.target_id_type
            this.useReference = true
            this.enriched = true
            this.backgroundModel = 'term-pres'
            this.refType = EXAMPLES.gene_set.reference_type
            this.readFileContent(EXAMPLES.gene_set.reference, 'reference')
            this.referenceIDType = EXAMPLES.gene_set.reference_id_type
          }
        } else {
          if (example === 'network') {
            this.readFileContent(EXAMPLES.disease_network.target, 'target')
            this.targetIDType = EXAMPLES.disease_network.target_id_type
            this.backgroundModel = 'network'
          } else {
            this.readFileContent(EXAMPLES.disease_set.target, 'target')
            this.targetIDType = EXAMPLES.disease_set.target_id_type
            this.backgroundModel = 'term-pres'

          }
        }
      } else if (mode === 'network') {

        if (type === 'gene') {
          if (example === 'set' || example === 'network') {
            this.readFileContent(EXAMPLES.gene_network.target, 'target')
            this.targetIDType = EXAMPLES.gene_network.target_id_type
            this.enriched = false
            this.backgroundModel = 'network'
            this.useReference = false
            this.references = ""
          }
          if (example === 'ref') {
            this.readFileContent(EXAMPLES.gene_network.target, 'target')
            this.targetIDType = EXAMPLES.gene_network.target_id_type
            this.useReference = true
            this.enriched = true
            this.backgroundModel = 'network'
            this.refType = EXAMPLES.gene_network.reference_type
            this.readFileContent(EXAMPLES.gene_network.reference, 'reference')
            this.referenceIDType = EXAMPLES.gene_network.reference_id_type
          }

        } else {
          this.readFileContent(EXAMPLES.disease_network.target, 'target')
          this.targetIDType = EXAMPLES.disease_network.target_id_type
          this.backgroundModel = 'network'
        }
      } else if (mode === 'cluster') {
        if (type === 'gene') {
          this.readFileContent(EXAMPLES.gene_cluster.target, 'target')
          this.targetIDType = EXAMPLES.gene_cluster.target_id_type
        } else {
          this.readFileContent(this.targets = EXAMPLES.disease_cluster.target, 'target')
          this.targetIDType = EXAMPLES.disease_cluster.target_id_type
        }
      }
    }
    ,


    getBackgroundModelItems: function () {
      let items = this.backgroundModels;
      if (this.mode !== 'network')
        items = items.filter(e => e.value !== 'network')
      if (this.mode === 'cluster')
        items = items.filter(e => e.value === 'complete')
      if (this.mode === 'network')
        items = items.filter(e => e.value === 'network')
      return items
    },

    checkEvent: async function () {
      this.errorTargetID = !this.targetIDType;
      this.errorTargetIDs = this.mode === 'cluster' ? this.clusters.length === 0 : this.targets.length === 0
      if (this.useReference) {
        this.errorReferenceID = !this.referenceIDType;
        this.errorReferenceIDs = this.references.length === 0
      } else {
        this.errorReferenceIDs = false
        this.errorReferenceID = false
      }
      if(this.mode ==='network' && !this.networkFile)
        this.errorNetwork=true
      if (this.mode === 'network' && this.networkFile) {
        this.errorNetworkFormat = !(this.networkFile.name.endsWith('.sif') || this.networkFile.name.endsWith('.graphml') || this.networkFile.name.endsWith('.gt'))
        this.errorNetworkIDType = !this.nodeType
        if (!this.networkFile.name.endsWith('.sif'))
          this.errorNetworkNodeName = !this.nodeName || this.nodeName.length===0
      }
      let error = this.errorTargetID || this.errorTargetIDs || this.errorReferenceID || this.errorReferenceIDs || this.errorNetworkIDType || this.errorNetworkFormat || this.errorNetworkNodeName || this.errorNetwork
      if (!error) {
        let route;
        let params = {
          type: this.type,
          targetID: this.targetIDType,
          target: this.mode === 'cluster' ? this.clusters : this.idsToList(this.targets),
          distance: this.distanceModel,
          runs: this.runs,
          replace: this.replace,
          background: this.backgroundModel,
        }
        if (this.mode === 'network') {
          params.network = this.networkFile ? {name: this.networkFile.name, data: await this.getNetwork(), id_type:this.nodeType, prop_name:this.nodeName} : undefined;
          route = 'network'
        } else if (this.useReference) {
          params.enriched = this.enriched
          params.referenceID = this.referenceIDType
          params.reference = this.idsToList(this.references)
          route = "set-set"
        } else {
          route = this.mode
        }
        params.mode = route
        this.$emit("validationEvent", params)
      }
    },
    getNetwork: async function () {
      if (this.networkFile) {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            resolve(event.target.result.split('base64,')[1])
          });
          reader.readAsDataURL(this.networkFile)
        }).then(result => {
          return result
        })
      } else
        return undefined;
    }
  }

}
</script>

<style scoped lang="sass">

.v-subheader
  margin: 8px

.flex
  display: flex

.flex_self_center
  display: flex
  justify-self: center
  margin-left: auto !important
  margin-right: auto !important

.flex_self_start
  justify-self: flex-start
  margin-right: auto !important
  margin-left: 0 !important

.flex_self_start_alt
  justify-self: flex-start
  margin-right: auto !important
  margin-left: auto !important

.flex_self_end
  justify-self: flex-end
  margin-right: 0 !important
  margin-left: auto !important

.flex_self_end_alt
  justify-self: flex-end
  margin-right: auto !important
  margin-left: auto !important

.flex_content_center
  justify-content: center
  display: flex

.example_div_width
  width: 100%
  display: flex
  margin: 4px

.sh_mobile
  font-size: 1.2rem

.ta_mobile
  padding: 0

.ta_not_mobile
  max-width: 40vw
  margin-left: auto
  margin-right: 0
  justify-self: flex-end

.sh
  font-size: 1.5rem
  margin-left: 64px
  margin-right: 64px

.margin_normal
  padding-left: 64px
  padding-right: 64px

.border
  padding-right: 64px
  padding-left: 64px

.border_mobile
  padding-right: 16px
  padding-left: 16px

.margin_mobile
  padding-left: 8px
  padding-right: 8px
</style>
