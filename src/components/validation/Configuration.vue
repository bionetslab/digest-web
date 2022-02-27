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
    <div style="display: flex;">
      <v-btn v-if="!isMobile()" color="error" @click="$emit('resetEvent')"
             style="justify-self: left; margin-right: auto;">
        <v-icon left>fas fa-angle-left</v-icon>
        Back
      </v-btn>
      <v-btn v-if="mode==='set' && type==='gene'" color="primary" outlined @click="loadExample('set', 'gene', 'set')"
             style="justify-self: center; margin:auto">
        <v-icon left>far fa-lightbulb</v-icon>
        Set only Example
      </v-btn>
      <v-btn v-if="mode==='set' && type==='gene'" color="primary" outlined @click="loadExample('set', 'gene', 'ref')"
             style="justify-self: center; margin:auto">
        <v-icon left>far fa-lightbulb</v-icon>
        Reference Example
      </v-btn>
      <v-btn v-if="mode==='cluster' && type==='gene'" color="primary" style="justify-self: center; margin:auto" outlined
             @click="loadExample('cluster', 'gene')">
        <v-icon left>far fa-lightbulb</v-icon>
        Example
      </v-btn>
      <v-btn v-if="mode==='cluster' && type==='disease'" style="justify-self: center; margin:auto" color="primary"
             outlined
             @click="loadExample('cluster', 'disease')">
        <v-icon left>far fa-lightbulb</v-icon>
        Example
      </v-btn>
      <v-btn v-if="mode==='set' && type==='disease'" color="primary" style="justify-self: center; margin:auto" outlined
             @click="loadExample('set', 'disease')">
        <v-icon left>far fa-lightbulb</v-icon>
        Example
      </v-btn>
      <v-btn v-if="!isMobile()" color="primary" @click="checkEvent"
             style="margin-left: auto; margin-right: 0; justify-self: flex-end">
        Validate
        <v-icon right>fas fa-angle-right</v-icon>
      </v-btn>
    </div>
    <v-sheet style="margin-top: 16px;">
      <v-divider></v-divider>
      <div style="display: flex; justify-content: center">
        <v-subheader>Targets</v-subheader>
      </div>
      <v-alert v-if="errorTargetID" type="error" dense>Missing target ID type selection</v-alert>
      <v-alert v-if="errorTargetIDs" type="error" dense>Missing targetIDs</v-alert>
      <div v-if="!isMobile()" style="display: flex; width: 100%; padding-right: 64px; padding-left: 64px">
        <div>
          <v-select label="Target ID type" :items="targetIDTypes[type]" v-model="targetIDType"
                    style="max-width: 200px" outlined dense filled>
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 250px; text-align: justify">
                  ID type of inserted target IDs. Click on the drop-down to see the supported types.
                </div>
              </v-tooltip>
            </template>
          </v-select>
          <v-file-input ref="tarInput" label="Upload targets" hint="Upload a file of newline separated target IDs" dense
                        style="width: 210px; max-width: 210px; cursor: pointer"
                        v-model="targetFile" @change="readTargetFile" prepend-icon="" filled outlined
                        prepend-inner-icon="fas fa-arrow-up-from-bracket">
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 250px; text-align: justify">
                  Upload of file with target IDs that are separated by a newline in the file.
                </div>
              </v-tooltip>
            </template>
          </v-file-input>
        </div>
        <v-textarea v-if="mode==='set'" label="Target IDs" v-model="targets"
                    style="max-width: 40vw; margin-left: auto; margin-right: 0; justify-self: flex-end" no-resize
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
        <v-data-table v-if="mode==='cluster'" item-key="id" :items="clusters"
                      style="max-width: 40vw; margin-left: auto; margin-right: 0; justify-self: flex-end" dense
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
                <v-text-field dense label="cluster" style="margin-bottom: -16px; margin-top:16px; padding-bottom: 6px"
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
      </div>
      <div v-else>
        <div style="width: 100%; padding-right: 64px; padding-left: 64px">
          <v-select label="Target ID type" :items="targetIDTypes[type]" v-model="targetIDType"
                    style="max-width: 200px;display: flex;justify-self: center; margin: auto" outlined dense filled>
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 250px; text-align: justify">
                  ID type of inserted target IDs. Click on the drop-down to see the supported types.
                </div>
              </v-tooltip>
            </template>
          </v-select>
          <v-file-input ref="tarInput" label="Upload targets" hint="Upload a file of newline separated target IDs" dense
                        style="width: 210px; max-width: 210px; cursor: pointer;display: flex;justify-self: center; margin: auto"
                        v-model="targetFile" @change="readTargetFile" prepend-icon="" filled outlined
                        prepend-inner-icon="fas fa-arrow-up-from-bracket">
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 250px; text-align: justify">
                  Upload of file with target IDs that are separated by a newline in the file.
                </div>
              </v-tooltip>
            </template>
          </v-file-input>
        </div>
        <div style="display: flex; justify-content: center; margin: auto">
          <v-textarea v-if="mode==='set'" label="Target IDs" v-model="targets"
                      style="padding:16px" no-resize
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
          <div style="display: flex; justify-self: center; margin: auto">
            <v-data-table v-if="mode==='cluster'" item-key="id" :items="clusters"
                          style="padding: 16px; margin-left: auto; margin-right: 0; justify-self: flex-end" dense
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
          </div>
        </div>
      </div>
      <v-divider></v-divider>
      <template v-if="mode==='set'">
        <div style="display: flex; justify-content: center; padding-left: 64px; padding-right: 64px">
          <v-subheader>References (optional)</v-subheader>
        </div>
        <div v-if="isMobile()" style="width: 100%; padding:16px">
          <div style="display:flex; justify-content: center; width: 100%">
            <v-checkbox v-model="useReference" label="Use reference"
                        style="">
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
          <v-alert v-if="errorReferenceID" type="error" dense>Missing reference ID type selection</v-alert>
          <v-alert v-if="errorReferenceIDs" type="error" dense>Missing reference IDs</v-alert>
          <div style="display:flex; justify-content: center; width: 100%">
            <v-select v-if="type==='gene'" outlined :disabled="!useReference" filled label="Reference type"
                      :items="refTypes" v-model="refType"
                      style="max-width: 180px" dense>
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
                      :items="[{text:'Disease',value:'disease'}]" v-model="refType"
                      style="max-width: 180px" dense>
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
          </div>
          <div style="display:flex; justify-content: center; width: 100%">
            <v-select outlined :disabled="!useReference" filled label="Reference ID type"
                      :items="targetIDTypes[refType]"
                      v-model="referenceIDType" style="max-width: 220px" dense>
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
          </div>
          <div style="display:flex; justify-content: center; width: 100%">
            <v-file-input ref="refInput" :disabled="!useReference" label="Upload references"
                          hint="Upload a file of newline separated reference IDs" dense
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
          </div>
          <div style="display:flex; justify-content: center; width: 100%">
            <v-textarea :disabled="!useReference" label="Reference IDs" filled
                        placeholder="Enter your chosen IDs newline separated..." v-model="references" no-resize>
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon style="top: -14px;right:-10px; margin-left: -21px" v-bind="attrs" v-on="on">far
                      fa-question-circle
                    </v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Manually add reference IDs newline separated. After inserting IDs manually or with a file upload,
                    IDs
                    can be changed or deleted as desired.
                  </div>
                </v-tooltip>
              </template>
            </v-textarea>
          </div>
        </div>
        <div v-else>
          <div style="display: flex; width: 100%; padding-left: 64px; padding-right: 64px">
            <v-checkbox v-model="useReference" label="Use reference"
                        style="justify-self: flex-start; margin-right: auto">
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
          <v-alert v-if="errorReferenceID" type="error" dense>Missing reference ID type selection</v-alert>
          <v-alert v-if="errorReferenceIDs" type="error" dense>Missing reference IDs</v-alert>
          <div style="display: flex; width: 100%; padding-left: 64px; padding-right: 64px">
            <div>
              <v-select v-if="type==='gene'" outlined :disabled="!useReference" filled label="Reference type"
                        :items="refTypes" v-model="refType"
                        style="max-width: 180px" dense>
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
                        :items="[{text:'Disease',value:'disease'}]" v-model="refType"
                        style="max-width: 180px" dense>
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
              <v-select outlined :disabled="!useReference" filled label="Reference ID type"
                        :items="targetIDTypes[refType]"
                        v-model="referenceIDType" style="max-width: 220px" dense>
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
              <v-file-input ref="refInput" :disabled="!useReference" label="Upload references"
                            hint="Upload a file of newline separated reference IDs" dense
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
            </div>
            <v-textarea :disabled="!useReference" label="Reference IDs" filled
                        placeholder="Enter your chosen IDs newline separated..." v-model="references" no-resize
                        style="max-width: 40vw; margin-left: auto; margin-right: 0; justify-self: flex-end;">
              <template v-slot:append>
                <v-tooltip right>
                  <template v-slot:activator="{on, attrs}">
                    <v-icon style="top: -14px;right:-10px; margin-left: -21px" v-bind="attrs" v-on="on">far
                      fa-question-circle
                    </v-icon>
                  </template>
                  <div style="width: 250px; text-align: justify">
                    Manually add reference IDs newline separated. After inserting IDs manually or with a file upload,
                    IDs
                    can be changed or deleted as desired.
                  </div>
                </v-tooltip>
              </template>
            </v-textarea>
          </div>
        </div>
        <v-divider></v-divider>
      </template>
      <div style="display: flex; justify-content: center">
        <v-subheader>Additional parameters (optional)</v-subheader>
      </div>
      <div v-if="isMobile()">
        <div style="display:flex; justify-content: center; width: 100%">
          <v-checkbox v-if="mode==='set'"
                      style="margin-top: 4px;"
                      :disabled="!useReference"
                      v-model="enriched"
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
        </div>
        <div style="display:flex; justify-content: center; width: 100%">
          <v-select label="Similarity measure" :items="distanceMeasures" v-model="distanceModel"
                    style="max-width: 240px"
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
                      defined as the size of the intersection divided by the size of the smaller of the two sets
                    </div>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-select>

        </div>
        <div style="display:flex; justify-content: center; width: 100%">
          <v-select label="Background model" :items="mode==='cluster' ? backgroundModels.filter(e=>e.value==='term-pres') : backgroundModels" v-model="backgroundModel"
                    style="max-width: 260px"
                 outlined dense filled>
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 400px;">
                  <div style="display: flex">
                    <div style="width: 40%">
                      Fully randomized:
                    </div>
                    <div style="width: 60%; text-align: justify">
                      Model draws {{ type }} uniformly without replacement to compute fully randomized {{ type }} sets
                      of
                      target set
                      size.
                    </div>
                  </div>
                  <div style="display: flex; margin-top: 8px;">
                    <div style="width: 40%">
                      Term-size preserving:
                    </div>
                    <div style="width: 60%; text-align: justify">
                      Model maintains some information from target set and constructs randomized {{ type }} sets where
                      the
                      distribution of the contained {{ type }}s' annotation set sizes (approximately) matches the
                      distribution
                      of the annotation set sizes of the {{ type }} contained in target set.
                    </div>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-select>

        </div>

      </div>
      <div v-else>
        <div style="display: flex;margin-top: 16px; padding-left: 64px; padding-right: 64px">
          <v-checkbox v-if="mode==='set'"
                      style="justify-self: flex-start; margin-right: auto; margin-left: 0; margin-top: 4px;"
                      :disabled="!useReference"
                      v-model="enriched"
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
          <v-select label="Similarity measure" :items="distanceMeasures" v-model="distanceModel"
                    :style="{'justify-self': mode==='set' ?'flex-start':'center', 'margin-left': 'auto', 'margin-right': 'auto', 'max-width': '240px'}"
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
                      defined as the size of the intersection divided by the size of the smaller of the two sets
                    </div>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-select>
          <v-select label="Background model" :items="mode==='cluster' ? backgroundModels.filter(e=>e.value==='term-pres') : backgroundModels" v-model="backgroundModel"
                    :style="{'justify-self': 'flex-end', 'margin-right' :mode==='set' ? 0: 'auto', 'margin-left': 'auto', 'max-width': '220px'}
                 " outlined dense filled>
            <template v-slot:append-outer>
              <v-tooltip right>
                <template v-slot:activator="{on, attrs}">
                  <v-icon v-bind="attrs" v-on="on">far fa-question-circle</v-icon>
                </template>
                <div style="width: 400px;">
                  <div style="display: flex">
                    <div style="width: 40%">
                      Fully randomized:
                    </div>
                    <div style="width: 60%; text-align: justify">
                      Model draws {{ type }} uniformly without replacement to compute fully randomized {{ type }} sets
                      of
                      target set
                      size.
                    </div>
                  </div>
                  <div style="display: flex; margin-top: 8px;">
                    <div style="width: 40%">
                      Term-size preserving:
                    </div>
                    <div style="width: 60%; text-align: justify">
                      Model maintains some information from target set and constructs randomized {{ type }} sets where
                      the
                      distribution of the contained {{ type }}s' annotation set sizes (approximately) matches the
                      distribution
                      of the annotation set sizes of the {{ type }} contained in target set.
                    </div>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-select>
        </div>
      </div>
      <div
          style="display: flex;justify-content: center; margin-bottom: 32px; margin-top: 16px;padding-left: 64px; padding-right: 64px">
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
      </div>
      <div
          style="display: flex;justify-content: center; margin-bottom: 32px; margin-top: 16px; padding-left: 64px; padding-right: 64px">
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
                How many percent of the target set elements should be replaced each run with random values based on the
                background model.
              </div>
            </v-tooltip>
          </template>
        </v-slider>
      </div>
      <v-divider></v-divider>
      <div style="display: flex; margin-top:8px">
        <v-btn color="error" @click="$emit('resetEvent')" style="justify-self: left; margin-right: auto;">
          <v-icon left>fas fa-angle-left</v-icon>
          Back
        </v-btn>

        <v-btn color="primary" @click="checkEvent" style="margin-left: auto; margin-right: 0; justify-self: flex-end">
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
      errorTargetID: false,
      errorTargetIDs: false,
      errorReferenceID: false, width: "50px",
      errorReferenceIDs: false,
      clusterIDModel: "",
      clusterModel: "",
      targetIDType: undefined,
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
      clusterHeaders: [
        {text: 'Target ID', align: 'start', sortable: true, value: 'id'},
        {text: 'Cluster', align: 'start', sortable: true, value: 'cluster'},
        {text: 'Action', align: 'end', sortable: false, width: "50px", value: 'action'}
      ],
      clusters: [],
      refTypes: [
        {text: "Gene", value: "gene"},
        {text: "Disease", value: "disease"},
      ],
      distanceMeasures: [
        {text: "Jaccard index", value: "jaccard"},
        {text: "Overlap coefficient", value: "overlap"}
      ],
      backgroundModel: this.mode==='cluster' ? 'term-pres' : "complete",
      backgroundModels: [
        {text: "Fully randomized", value: "complete"},
        {text: "Term-size preserving", value: "term-pres"}
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
        this.readFile(file, 'target')
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
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
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

    readFile: function (file, goal) {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let result = event.target.result
        this.readFileContent(atob(result.split('base64,')[1]), goal)
      });
      reader.readAsDataURL(file);
    },

    removeClusterEntry: function (item) {
      this.clusters.splice(this.clusters.indexOf(item), 1)
    },
    addClusterEntry: function () {
      if (this.clusterModel && this.clusterIDModel && this.clusterModel.length > 0 && this.clusterIDModel.length > 0) {
        this.addToClusters(this.clusterIDModel, this.clusterModel)
        this.clusterModel = ""
        this.clusterIDModel = ""
      }
    },


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
    },

    setNotification: function (message, timeout) {
      if (timeout)
        this.notification.timeout = timeout
      if (message)
        this.notification.message = message
      this.notification.show = true
    },
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
          this.readFileContent(EXAMPLES.disease_set.target, 'target')
          this.targetIDType = EXAMPLES.disease_set.target_id_type
          this.backgroundModel = 'term-pres'
        }
      } else {
        if (type === 'gene') {
          this.readFileContent(EXAMPLES.gene_cluster.target, 'target')
          this.targetIDType = EXAMPLES.gene_cluster.target_id_type
        } else {
          this.readFileContent(this.targets = EXAMPLES.disease_cluster.target, 'target')
          this.targetIDType = EXAMPLES.disease_cluster.target_id_type
        }
      }
    },

    checkEvent: function () {
      this.errorTargetID = !this.targetIDType;
      this.errorTargetIDs = this.mode === 'cluster' ? this.clusters.length === 0 : this.targets.length === 0
      if (this.useReference) {
        this.errorReferenceID = !this.referenceIDType;
        this.errorReferenceIDs = this.references.length === 0
      } else {
        this.errorReferenceIDs = false
        this.errorReferenceID = false
      }
      let error = this.errorTargetID || this.errorTargetIDs || this.errorReferenceID || this.errorReferenceIDs
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
        if (this.useReference) {
          params.enriched = this.enriched
          params.referenceID = this.referenceIDType
          params.reference = this.idsToList(this.references)
          route = "set-set"
        } else {
          route = this.mode === 'cluster' ? 'cluster' : "set"
        }
        params.mode = route
        this.$emit("validationEvent", params)
      }
    }
  }

}
</script>

<style scoped lang="sass">
.v-subheader
  font-size: 1.5rem
  margin: 8px

</style>
