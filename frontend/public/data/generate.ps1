$Countries = @(
    @{iso="AFG"; name="Afghanistan"}, @{iso="ALB"; name="Albania"}, @{iso="DZA"; name="Algeria"}, @{iso="AND"; name="Andorra"},
    @{iso="AGO"; name="Angola"}, @{iso="ATG"; name="Antigua and Barbuda"}, @{iso="ARG"; name="Argentina"}, @{iso="ARM"; name="Armenia"},
    @{iso="AUS"; name="Australia"}, @{iso="AUT"; name="Austria"}, @{iso="AZE"; name="Azerbaijan"}, @{iso="BHS"; name="Bahamas"},
    @{iso="BHR"; name="Bahrain"}, @{iso="BGD"; name="Bangladesh"}, @{iso="BRB"; name="Barbados"}, @{iso="BLR"; name="Belarus"},
    @{iso="BEL"; name="Belgium"}, @{iso="BLZ"; name="Belize"}, @{iso="BEN"; name="Benin"}, @{iso="BTN"; name="Bhutan"},
    @{iso="BOL"; name="Bolivia"}, @{iso="BIH"; name="Bosnia and Herzegovina"}, @{iso="BWA"; name="Botswana"}, @{iso="BRA"; name="Brazil"},
    @{iso="BRN"; name="Brunei"}, @{iso="BGR"; name="Bulgaria"}, @{iso="BFA"; name="Burkina Faso"}, @{iso="BDI"; name="Burundi"},
    @{iso="CPV"; name="Cabo Verde"}, @{iso="KHM"; name="Cambodia"}, @{iso="CMR"; name="Cameroon"}, @{iso="CAN"; name="Canada"},
    @{iso="CAF"; name="Central African Republic"}, @{iso="TCD"; name="Chad"}, @{iso="CHL"; name="Chile"}, @{iso="CHN"; name="China"},
    @{iso="COL"; name="Colombia"}, @{iso="COM"; name="Comoros"}, @{iso="COG"; name="Congo"}, @{iso="COD"; name="DR Congo"},
    @{iso="CRI"; name="Costa Rica"}, @{iso="CIV"; name="Cote d'Ivoire"}, @{iso="HRV"; name="Croatia"}, @{iso="CUB"; name="Cuba"},
    @{iso="CYP"; name="Cyprus"}, @{iso="CZE"; name="Czech Republic"}, @{iso="DNK"; name="Denmark"}, @{iso="DJI"; name="Djibouti"},
    @{iso="DMA"; name="Dominica"}, @{iso="DOM"; name="Dominican Republic"}, @{iso="ECU"; name="Ecuador"}, @{iso="EGY"; name="Egypt"},
    @{iso="SLV"; name="El Salvador"}, @{iso="GNQ"; name="Equatorial Guinea"}, @{iso="ERI"; name="Eritrea"}, @{iso="EST"; name="Estonia"},
    @{iso="SWZ"; name="Eswatini"}, @{iso="ETH"; name="Ethiopia"}, @{iso="FJI"; name="Fiji"}, @{iso="FIN"; name="Finland"},
    @{iso="FRA"; name="France"}, @{iso="GAB"; name="Gabon"}, @{iso="GMB"; name="Gambia"}, @{iso="GEO"; name="Georgia"},
    @{iso="DEU"; name="Germany"}, @{iso="GHA"; name="Ghana"}, @{iso="GRC"; name="Greece"}, @{iso="GRD"; name="Grenada"},
    @{iso="GTM"; name="Guatemala"}, @{iso="GIN"; name="Guinea"}, @{iso="GNB"; name="Guinea-Bissau"}, @{iso="GUY"; name="Guyana"},
    @{iso="HTI"; name="Haiti"}, @{iso="HND"; name="Honduras"}, @{iso="HUN"; name="Hungary"}, @{iso="ISL"; name="Iceland"},
    @{iso="IND"; name="India"}, @{iso="IDN"; name="Indonesia"}, @{iso="IRN"; name="Iran"}, @{iso="IRQ"; name="Iraq"},
    @{iso="IRL"; name="Ireland"}, @{iso="ISR"; name="Israel"}, @{iso="ITA"; name="Italy"}, @{iso="JAM"; name="Jamaica"},
    @{iso="JPN"; name="Japan"}, @{iso="JOR"; name="Jordan"}, @{iso="KAZ"; name="Kazakhstan"}, @{iso="KEN"; name="Kenya"},
    @{iso="KIR"; name="Kiribati"}, @{iso="PRK"; name="North Korea"}, @{iso="KOR"; name="South Korea"}, @{iso="KWT"; name="Kuwait"},
    @{iso="KGZ"; name="Kyrgyzstan"}, @{iso="LAO"; name="Laos"}, @{iso="LVA"; name="Latvia"}, @{iso="LBN"; name="Lebanon"},
    @{iso="LSO"; name="Lesotho"}, @{iso="LBR"; name="Liberia"}, @{iso="LBY"; name="Libya"}, @{iso="LIE"; name="Liechtenstein"},
    @{iso="LTU"; name="Lithuania"}, @{iso="LUX"; name="Luxembourg"}, @{iso="MDG"; name="Madagascar"}, @{iso="MWI"; name="Malawi"},
    @{iso="MYS"; name="Malaysia"}, @{iso="MDV"; name="Maldives"}, @{iso="MLI"; name="Mali"}, @{iso="MLT"; name="Malta"},
    @{iso="MHL"; name="Marshall Islands"}, @{iso="MRT"; name="Mauritania"}, @{iso="MUS"; name="Mauritius"}, @{iso="MEX"; name="Mexico"},
    @{iso="FSM"; name="Micronesia"}, @{iso="MDA"; name="Moldova"}, @{iso="MCO"; name="Monaco"}, @{iso="MNG"; name="Mongolia"},
    @{iso="MNE"; name="Montenegro"}, @{iso="MAR"; name="Morocco"}, @{iso="MOZ"; name="Mozambique"}, @{iso="MMR"; name="Myanmar"},
    @{iso="NAM"; name="Namibia"}, @{iso="NRU"; name="Nauru"}, @{iso="NPL"; name="Nepal"}, @{iso="NLD"; name="Netherlands"},
    @{iso="NZL"; name="New Zealand"}, @{iso="NIC"; name="Nicaragua"}, @{iso="NER"; name="Niger"}, @{iso="NGA"; name="Nigeria"},
    @{iso="MKD"; name="North Macedonia"}, @{iso="NOR"; name="Norway"}, @{iso="OMN"; name="Oman"}, @{iso="PAK"; name="Pakistan"},
    @{iso="PLW"; name="Palau"}, @{iso="PAN"; name="Panama"}, @{iso="PNG"; name="Papua New Guinea"}, @{iso="PRY"; name="Paraguay"},
    @{iso="PER"; name="Peru"}, @{iso="PHL"; name="Philippines"}, @{iso="POL"; name="Poland"}, @{iso="PRT"; name="Portugal"},
    @{iso="QAT"; name="Qatar"}, @{iso="ROU"; name="Romania"}, @{iso="RUS"; name="Russia"}, @{iso="RWA"; name="Rwanda"},
    @{iso="KNA"; name="Saint Kitts and Nevis"}, @{iso="LCA"; name="Saint Lucia"}, @{iso="VCT"; name="Saint Vincent and the Grenadines"}, @{iso="WSM"; name="Samoa"},
    @{iso="SMR"; name="San Marino"}, @{iso="STP"; name="Sao Tome and Principe"}, @{iso="SAU"; name="Saudi Arabia"}, @{iso="SEN"; name="Senegal"},
    @{iso="SRB"; name="Serbia"}, @{iso="SYC"; name="Seychelles"}, @{iso="SLE"; name="Sierra Leone"}, @{iso="SGP"; name="Singapore"},
    @{iso="SVK"; name="Slovakia"}, @{iso="SVN"; name="Slovenia"}, @{iso="SLB"; name="Solomon Islands"}, @{iso="SOM"; name="Somalia"},
    @{iso="ZAF"; name="South Africa"}, @{iso="SSD"; name="South Sudan"}, @{iso="ESP"; name="Spain"}, @{iso="LKA"; name="Sri Lanka"},
    @{iso="SDN"; name="Sudan"}, @{iso="SUR"; name="Suriname"}, @{iso="SWE"; name="Sweden"}, @{iso="CHE"; name="Switzerland"},
    @{iso="SYR"; name="Syria"}, @{iso="TWN"; name="Taiwan"}, @{iso="TJK"; name="Tajikistan"}, @{iso="TZA"; name="Tanzania"},
    @{iso="THA"; name="Thailand"}, @{iso="TLS"; name="Timor-Leste"}, @{iso="TGO"; name="Togo"}, @{iso="TON"; name="Tonga"},
    @{iso="TTO"; name="Trinidad and Tobago"}, @{iso="TUN"; name="Tunisia"}, @{iso="TUR"; name="Turkey"}, @{iso="TKM"; name="Turkmenistan"},
    @{iso="TUV"; name="Tuvalu"}, @{iso="UGA"; name="Uganda"}, @{iso="UKR"; name="Ukraine"}, @{iso="ARE"; name="United Arab Emirates"},
    @{iso="GBR"; name="United Kingdom"}, @{iso="USA"; name="United States"}, @{iso="URY"; name="Uruguay"}, @{iso="UZB"; name="Uzbekistan"},
    @{iso="VUT"; name="Vanuatu"}, @{iso="VEN"; name="Venezuela"}, @{iso="VNM"; name="Vietnam"}, @{iso="YEM"; name="Yemen"},
    @{iso="ZMB"; name="Zambia"}, @{iso="ZWE"; name="Zimbabwe"}
)

$MapData = @()
$DeepdiveData = @()
$CountriesList = @()

$rand = New-Object System.Random

foreach ($c in $Countries) {
    $CountriesList += $c.name
    
    $riskScore = $rand.NextDouble() * 100
    $riskLevel = "LOW"
    if ($riskScore -ge 75) { $riskLevel = "VERY HIGH" }
    elseif ($riskScore -ge 50) { $riskLevel = "HIGH" }
    elseif ($riskScore -ge 25) { $riskLevel = "MEDIUM" }
    
    $MapData += @{
        iso_alpha3 = $c.iso
        country = $c.name
        risk_score = [math]::Round($riskScore, 1)
        risk_level = $riskLevel
    }
    
    for ($year = 2015; $year -le 2025; $year++) {
        $yearRisk = $riskScore + ($rand.NextDouble() * 20 - 10)
        if ($yearRisk -lt 0) { $yearRisk = 0 }
        if ($yearRisk -gt 100) { $yearRisk = 100 }
        
        $DeepdiveData += @{
            country = $c.name
            year = $year
            risk_score = [math]::Round($yearRisk, 1)
            risk_level = $riskLevel
            inflation = [math]::Round(($rand.NextDouble() * 20 - 2), 2)
            gdp_growth = [math]::Round(($rand.NextDouble() * 12 - 4), 2)
            government_debt = [math]::Round(($rand.NextDouble() * 150 + 20), 2)
            conflict_events = $rand.Next(0, 1000)
            interest_rate = [math]::Round(($rand.NextDouble() * 15), 2)
        }
    }
}

$MapData | ConvertTo-Json -Depth 10 | Out-File -FilePath "d:/NEW/frontend/public/data/map.json" -Encoding utf8
$DeepdiveData | ConvertTo-Json -Depth 10 | Out-File -FilePath "d:/NEW/frontend/public/data/deepdive.json" -Encoding utf8
$CountriesList | ConvertTo-Json -Depth 10 | Out-File -FilePath "d:/NEW/frontend/public/data/countries.json" -Encoding utf8

Write-Host "JSON files generated successfully."
