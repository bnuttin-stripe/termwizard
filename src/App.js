// Modules
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './index.css';
import Clippy from './clippy.jpg';

export default function App() {
    const [matrix, setMatrix] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [posType, setPOSType] = useState('');
    const [posPlatform, setPosPlatform] = useState('');
    const [offlineMode, setOfflineMode] = useState('');
    const [screen, setScreen] = useState('');
    const [connectivity, setConnectivity] = useState('');
    const [recommendation, setRecommendation] = useState({});

    const getChoices = (question) => {
        let output = [];
        for (let i = 0; i < matrix.length; i++) {
            output.push(matrix[i][question]);
        }
        return [...new Set(output)];
    }

    const load = function () {
        setIsLoading(true);
        fetch('./matrix.csv')
            .then(response => response.text())
            .then(responseText => {
                Papa.parse(responseText, {
                    header: true,
                    skipEmptyLines: false,
                    complete: function (results) {
                        setMatrix(results.data);
                        setIsLoading(false);
                    },
                });
            })
    };

    useEffect(() => {
        load()
    }, []);

    const generateRecommendation = () => {
        setRecommendation({});
        for (let i = 0; i < matrix.length; i++) {
            let row = matrix[i];
            if (row['POS Platform'] == posPlatform && row['Offline Mode'] == offlineMode && row['Screen'] == screen && row['Connectivity'] == connectivity) {
                setRecommendation(row);
            }
        }
    }

    useEffect(() => {
        if (posType == '' || posPlatform == '' || offlineMode == '' || screen == '' || connectivity == '') return;
        generateRecommendation();
    }, [posType, posPlatform, offlineMode, screen, connectivity]);

    return (
        <div className="container pt-5">
            <div className="col-6 offset-3">
                <div className="row mb-4">
                    <div className="d-flex justify-content-between">
                        <img src={Clippy} alt="Clippy" className="clippy" />
                        <div className="banner">It looks like you're trying to integrate Terminal - can I help you?</div>
                    </div>
                </div>
                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">Is your POS custom or Off the Shelf?</label>
                    <div className="col-sm-6">
                        <select className="form-control " value={posType} onChange={e => setPOSType(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            <option value="Custom">Custom</option>
                            <option value="COTS">Commercial product</option>
                        </select>
                    </div>
                </div>

                {posType == 'Custom' && <>
                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">What platform is your POS?</label>
                    <div className="col-sm-6">
                        <select className="form-control" value={posPlatform} onChange={e => setPosPlatform(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            {getChoices('POS Platform').map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">Do you need offline mode?</label>
                    <div className="col-sm-6">
                        <select className="form-control" value={offlineMode} onChange={e => setOfflineMode(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            {getChoices('Offline Mode').map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">Do you need a screen?</label>
                    <div className="col-sm-6">
                        <select className="form-control" value={screen} onChange={e => setScreen(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            {getChoices('Screen').map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">How will you connect to the POI?</label>
                    <div className="col-sm-6">
                        <select className="form-control" value={connectivity} onChange={e => setConnectivity(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            {getChoices('Connectivity').map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                    </div>
                </div>

                {Object.keys(recommendation).length > 0 && <div className="row alert alert-primary mt-4"  style={{margin: 0}}>
                    {recommendation["Reader - mPOS"] == "x" && <div>Reader - mPOS</div>}
                    {recommendation["Reader - sPOS"] == "x" && <div>Reader - sPOS</div>}
                    {recommendation["Reader - Tap-to-pay"] == "x" && <div>Reader - Tap-to-pay</div>}
                    {recommendation["Reader - AoD"] == "x" && <div>Reader - AoD</div>}
                    {recommendation["Integration - Server Driven"] == "x" && <div>Integration - SDI</div>}
                    {recommendation["Integration - JavaScript SDK"] == "x" && <div>Integration - JavaScript</div>}
                    {recommendation["Integration - iOS SDK"] == "x" && <div>Integration - iOS</div>}
                    {recommendation["Integration - Android SDK"] == "x" && <div>Integration - Android</div>}
                    {recommendation["Integration - .NET SDK"] == "beta" && <div>Integration - .NET (beta)</div>}
                    {recommendation["Integration - Java SDK"] == "beta" && <div>Integration - Java (beta)</div>}
                    {recommendation["Connectivity - Ethernet"] == "x" && <div>Connectivity - Ethernet</div>}
                    {recommendation["Connectivity - USB"] == "x" && <div>Connectivity - USB</div>}
                    {recommendation["Connectivity - WiFi"] == "x" && <div>Connectivity - WiFi</div>}
                    {recommendation["Connectivity - Cellular"] == "x" && <div>Connectivity - Cellular</div>}
                    {recommendation["Connectivity - Bluetooth"] == "x" && <div>Connectivity - Bluetooth</div>}
                </div>}
                </>}
                








                {posType == 'COTS' && 
                <div className="row alert alert-primary mt-4" style={{margin: 0}}>
                    We have a number of pre-built connectors and partners that can help with your integration. Please contact Sales for more information.
                </div>}

                {recommendation["Warning"] &&  
                <div className="row mt-4 alert alert-warning" style={{margin: 0}}>
                    {recommendation["Warning"] == "Silly" && <div>This is a bit of an unusual set up, but go for it!</div>}
                    {recommendation["Warning"] == "Offline Issue" && <div>If your POS is web based, offline mode is not be applicable</div>}
                    {recommendation["Warning"] == "Internal Only" && <div>This setup </div>}
                </div>}
            </div>
        </div>
    )
}