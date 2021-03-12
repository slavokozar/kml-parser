import React, {useState} from "react";
import { kml } from "@tmcw/togeojson";

import './App.css';


function App() {
    const [file, setFile] = useState( null );
    const [status, setStatus] = useState('No file selected');

    const readFile = () => {
        if (!file) {
            setStatus('No file selected');
            return;
        }

        setStatus('Loading File');
        const reader = new FileReader();
        reader.onload = (e) => {
            setStatus('File Loaded');
            const content = e.target.result;


            setStatus('XML parsing');
            const xml = convertToXmlDom(content);

            if(!xml){
                setStatus('XML parsing failed')
                return;
            }

            setStatus('Converting to GeoJSON');

            const geoJson = kml(xml);
            setStatus('Success');
            console.log(geoJson);

            const coords = geoJson.features.map((feature) => ({
                lat: feature.geometry.coordinates[0],
                lng: feature.geometry.coordinates[1],
                elv: feature.geometry.coordinates[2],
            }));

            console.log(coords);
        };

        reader.readAsText(file);
    }

    const convertToXmlDom = (text) => {
        const parser = new DOMParser();

        const xml = parser.parseFromString(text,"text/xml");

        if(xml.getElementsByTagName("parsererror").length > 0){
            return null;
        }
        return xml;
    }

    return (
        <div className="App">
            <header className="App-header">
                <div style={{width: '75vw',display: 'flex', justifyContent:'space-evenly'}}>
                    <input
                        type="file"
                        onChange={( e ) => {
                            setFile( e.target.files[ 0 ] )
                        }}
                    />
                    <button onClick={() => readFile()}>
                        Convert!
                    </button>
                </div>
                <h2>{status}</h2>

            </header>
        </div>
    );
}

export default App;
