import React, {Component, useState, useEffect} from 'react'

const urls = {
  image: (genome, study, gene) => `https://bar.utoronto.ca/api/efp_image/efp_${genome}/${study}/Absolute/${gene}`,
  app: (genome, study, gene) => `https://bar.utoronto.ca/efp_${genome}/cgi-bin/efpWeb.cgi?dataSource=${study}&mode=Absolute&primaryGene=${gene}`,
  studies: genome => `https://bar.utoronto.ca/api/efp_image/get_efp_data_source/${genome}`,
  logo: 'https://bar.utoronto.ca/bbc_logo_small.gif',
  spinner: 'https://www.sorghumbase.org/static/images/dna_spinner.svg'
}
const browsers = {
  sorghum_bicolor: {
    formatGene: gene => gene._id.replace('SORBI_3','Sobic.'),
    genome: 'sorghum'
  },
  arabidopsis_thaliana: {
    formatGene: gene => gene._id,
    genome: 'arabidopsis'
  },
  zea_mays: {
    formatGene: gene => gene.synonyms[0],
    genome: 'maize'
  },
  glycine_max: {
    formatGene: gene => gene._id.replace('GLYMA_','Glyma.'),
    genome: 'soybean'
  }
}

const ImageLoader = props => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const image = new Image();
    image.src = props.url;
    image.onload = () => {
      setLoading(false);
    };
    image.onerror = () => {
      setLoading(false);
      setError(true);
    }
  }, [props.url]);

  return (
    <div className="BAR-container">
      {loading && <img src={urls.spinner} alt="Loading..." />}
      {!loading && !error && <img style={{'max-width':'100%'}} src={props.url} />}
      {error && <p>Error: Failed to load image</p>}
    </div>
  );
}

export default class BAR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStudy: null
    }
  }
  getStudies(genome) {
    fetch(urls.studies(genome))
      .then(response => response.json())
      .then(res => {
        if (res.wasSuccessful) {
          const studies = res.data.sort().map(v => {
            return {value: v, label: v.replace(/_/g,' ')}
          });
          this.setState({studies});
        }
      })
      .catch(console.error)
  }
  render() {
    const gene = this.props.gene;
    let study = this.state.currentStudy;
    const browser = browsers[gene.system_name];
    if (!browser) {
      return <div><h2>Can't find eFP browser for {gene.system_name}</h2></div>
    }
    if (!this.state.studies) {
      this.getStudies(browser.genome);
      return <img src={urls.spinner} alt="Loading..." />
    }
    const efp_gene = browser.formatGene(gene);
    if (!study) {
      study = this.state.studies[0].value;
    }
    return <div>
      <label>Select a study:</label>
      <select value={study} onChange={(e) => this.setState({currentStudy: e.target.value})}>
        {this.state.studies.map((s,idx) => <option key={idx} value={s.value}>{s.label}</option>)}
      </select><br/>
      <ImageLoader url={urls.image(browser.genome,study,efp_gene)}/>
      <a href={urls.app(browser.genome,study,efp_gene)}>
        Powered by <img src={urls.logo}/> BAR Webservices
      </a>
    </div>
  }
}

export function haveBAR(gene) {
  return browsers.hasOwnProperty(gene.system_name);
}

