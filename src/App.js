// Modules
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './index.css';

export default function App() {
    const [matrix, setMatrix] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [posType, setPOSType] = useState('');
    const [posPlatform, setPosPlatform] = useState('');
    const [offlineMode, setOfflineMode] = useState('');
    const [screen, setScreen] = useState('');
    const [connectivity, setConnectivity] = useState('');
    const [recommendation, setRecommendation] = useState([]);

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
        setRecommendation([]);
        for (let i = 0; i < matrix.length; i++) {
            let row = matrix[i];
            if (row['POS Platform'] == posPlatform && row['Offline Mode'] == offlineMode && row['Screen'] == screen && row['Connectivity'] == connectivity) {
                setRecommendation(row);
            }
        }
        //setRecommendation(recommendation);
    }

    useEffect(() => {
        if (posType == '' || posPlatform == '' || offlineMode == '' || screen == '' || connectivity == '') return;
        generateRecommendation();
    }, [posType, posPlatform, offlineMode, screen, connectivity]);

    return (
        <div className="container pt-5">
            <div className="col-6 offset-3">
                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">Is your POS custom or Off the Shelf?</label>
                    <div class="col-sm-6">
                        <select className="form-control " value={posType} onChange={e => setPOSType(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            <option value="Custom">Custom</option>
                            <option value="COTS">Commercial product</option>
                        </select>
                    </div>

                </div>

                <div className="form-group row mb-2">
                    <label className="col-sm-6 col-form-label">What platform is your POS?</label>
                    <div class="col-sm-6">
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
                    <div class="col-sm-6">
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
                    <div class="col-sm-6">
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
                    <div class="col-sm-6">
                        <select className="form-control" value={connectivity} onChange={e => setConnectivity(e.target.value)}>
                            <option value="">-- Pick one -- </option>
                            {getChoices('Connectivity').map((choice, index) => {
                                return <option key={index} value={choice}>{choice}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="row recommendation">
                    {recommendation["Reader - mPOS"] == "x" && <div>Reader - mPOS</div>}
                    {recommendation["Reader - sPOS"] == "x" && <div>Reader - sPOS</div>}
                    {recommendation["Reader - Tap-to-pay"] == "x" && <div>Reader - Tap-to-pay</div>}
                    {recommendation["Reader - AoD"] == "x" && <div>Reader - AoD</div>}
                    {recommendation["Integration - SDI"] == "x" && <div>Integration - SDI</div>}
                    {recommendation["Integration - JavaScript"] == "x" && <div>Integration - JavaScript</div>}
                    {recommendation["Integration - iOS"] == "x" && <div>Integration - iOS</div>}
                    {recommendation["Integration - Android"] == "x" && <div>Integration - Android</div>}
                    {recommendation["Integration - .NET"] == "beta" && <div>Integration - .NET (beta)</div>}
                    {recommendation["Integration - Java"] == "beta" && <div>Integration - Java (beta)</div>}
                    {recommendation["Connectivity - Ethernet"] == "x" && <div>Connectivity - Ethernet</div>}
                    {recommendation["Connectivity - USB"] == "x" && <div>Connectivity - USB</div>}
                    {recommendation["Connectivity - WiFi"] == "x" && <div>Connectivity - WiFi</div>}
                    {recommendation["Connectivity - Cellular"] == "x" && <div>Connectivity - Cellular</div>}
                    {recommendation["Connectivity - Bluetooth"] == "x" && <div>Connectivity - Bluetooth</div>}
                </div>
            </div>
        </div>
    )
}