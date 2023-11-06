import React, {Component} from 'react'
import {render} from 'react-dom'
import {Tabs, Tab} from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import BAR, {haveBAR} from '../../src'

const g1 = {
  _id: 'SORBI_3001G000100',
  system_name: 'sorghum_bicolor'
};
const g2 = {
  _id: 'AT3G27340',
  system_name: 'arabidopsis_thaliana'
};
const g3 = {
  _id: 'Zm00001eb383680',
  system_name: 'zea_mays',
  synonyms: ['GRMZM2G083841','Zm00001d046170']
};
const g4 = {
  _id: 'GLYMA_06G047400',
  system_name: 'glycine_max'
};
export default class Demo extends Component {
  render() {
    return <div>
      <h1>gramene-efp-browser Demo</h1>
      <Tabs>
        <Tab eventKey='sorghum' title='sorghum'>{haveBAR(g1) && <BAR gene={g1}/>}</Tab>
        <Tab eventKey='arabidopsis' title='arabidopsis'>{haveBAR(g2) && <BAR gene={g2}/>}</Tab>
        <Tab eventKey='maize' title='maize'>{haveBAR(g3) && <BAR gene={g3}/>}</Tab>
        <Tab eventKey='soybean' title='soybean'>{haveBAR(g4) && <BAR gene={g4}/>}</Tab>
      </Tabs>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
