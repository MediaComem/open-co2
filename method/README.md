![Open Database and API for CO₂ equivalencies](../cover.png)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Method and information](#method-and-information)
  - [Scope](#scope)
  - [Limitations](#limitations)
    - [Location](#location)
    - [Food data](#food-data)
    - [Missing environmental impact indicators](#missing-environmental-impact-indicators)
  - [Data source](#data-source)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Method and information

Data are based on [Life-cycle assessment (LCA)](https://en.wikipedia.org/wiki/Life-cycle_assessment).

## Scope

The expected use case of the data from this repository is for SMEs to estimate a simplified company's carbon footprint based on easy accessible data.
The first version of the data is oriented towards most of the tertiary sector companies. Its use is not yet recommended for agricultural and industry sectors companies, and for shipping and transportation services.

Here are the most relevant categories identified:

- Energy consumption (electricity / heating)
- Travels (commuting, business travel)
- IT equipment
- Basic office furniture
- Meals

CO2 equivalent data of services such as energy and transport include the infrastructures’ life cycles (i.e. power plants, roads, cars). Due to the expected use case, the CO2 equivalent data of products (IT equipment and office furniture) in the database corresponds to a **cradle to gate** evaluation (i.e. Impact of resource extraction + Manufacturing). The use phase of purchased products (i.e. IT) corresponds mostly to energy consumption and is thus included in the operational stage of the company.
The end of life (EoL) analysis is considered insignificant for most of the assessed products. In case it has a significant impact, it has been added to the value returned by the API. See [End of life relative contribution analysis](raw%20data/EndOfLifeAnalysis.pdf) document.

New data and categories will be added in future developments to expand the API’s scope to other economic activities.

## Limitations

### Location

Although most of the data are independent of the location, the database is targeted to be used for use cases in **Switzerland**. In particular energy information are based on Swiss electricity providers and Swiss energy mix, public transports on Swiss public transport providers.

### Food data

Food LCA data are given as an indicative value only and many input parameters have been discarded to ease the use of the API for the use case in mind. In particular, food LCA impact is very sensitive to the following parameters that are not considered here:

- seasonality (in / off season)
- transport (local, air, freight transport)
- organic / non-organic (impacting also other indicators than GWP)

### Missing environmental impact indicators

For simplicity, the current Database / API considers only GWP (Global Warming Potential) and do not consider other environmental impact (resource depletion, ozone depletion, acidification of soil and water, eutrophication, etc.).

## Suggestions on using the data

**Due to the limitations mentioned above, the data may not be suitable for in-depth environmental decision making. Rather, they are useful to support comparison of a company’s CO2-equivalent emissions over time and to identify the biggest “hot-spots” in its activities.**

## Data source

You can check the details of the sources used for a specific data by checking the `source` field of the data returned by the API.
The number of sources has been limited to keep consistency between data sources. As a basic rule, only one source is used for a specific field.

Here are the main external sources used:

- [KBOB](https://www.kbob.admin.ch/kbob/de/home/themen-leistungen/nachhaltiges-bauen/oekobilanzdaten_baubereich.html): Swiss confederation data for construction eco analysis
- [Ademe](https://www.ademe.fr): French Agency for Ecological Transition
- [EPFL](https://www.epfl.ch/campus/restaurants-shops-hotels/fr/nos-promesses/sain/nutrimenu/#): ecoMenu sustainability project from École Polytechnique Fédérale de Lausanne

The consolidation, analysis and verification of data for the version 1.0 was conducted by the [IGT](https://heig-vd.ch/rad/instituts/igt) from the Swiss Universities of Applied Science Wester Switzerland.

More information for derived data (original data and hypotheses) are available in the [raw data](raw%20data/) folder.
