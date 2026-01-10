/**
 * Database Seed Script
 * Run with: npm run seed
 */

import { config } from 'dotenv';
import { DataSource, In } from 'typeorm';
import { PaymentGateway } from '../entities/payment-gateway.entity';
import { Country } from '../entities/country.entity';
import { Currency } from '../entities/currency.entity';
import { Sponsor } from '../entities/sponsor.entity';
import { FounderOffer } from '../entities/founder-offer.entity';

// Full list of countries
const countriesList = [
    { name: 'Afghanistan', code: 'AF' }, { name: 'Åland Islands', code: 'AX' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'AndorrA', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia', code: 'BO' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, The Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote D\'Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guinea-Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and Mcdonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran, Islamic Republic Of', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea, Democratic People\'S Republic of', code: 'KP' }, { name: 'Korea, Republic of', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao People\'S Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libyan Arab Jamahiriya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia, Federated States of', code: 'FM' }, { name: 'Moldova, Republic of', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'Netherlands Antilles', code: 'AN' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Palestinian Territory, Occupied', code: 'PS' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'RWANDA', code: 'RW' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Senegal', code: 'SN' }, { name: 'Serbia and Montenegro', code: 'CS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Georgia and the South Sandwich Islands', code: 'GS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan, Province of China', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania, United Republic of', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor-Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands, British', code: 'VG' }, { name: 'Virgin Islands, U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }
];

// Full list of currencies
const currenciesList = [
    { "cc": "AED", "symbol": "\u062f.\u0628", "name": "UAE dirham" },
    { "cc": "AFN", "symbol": "Afs", "name": "Afghan afghani" },
    { "cc": "ALL", "symbol": "L", "name": "Albanian lek" },
    { "cc": "AMD", "symbol": "AMD", "name": "Armenian dram" },
    { "cc": "ANG", "symbol": "NA\u0192", "name": "Netherlands Antillean gulden" },
    { "cc": "AOA", "symbol": "Kz", "name": "Angolan kwanza" },
    { "cc": "ARS", "symbol": "$", "name": "Argentine peso" },
    { "cc": "AUD", "symbol": "$", "name": "Australian dollar" },
    { "cc": "AWG", "symbol": "\u0192", "name": "Aruban florin" },
    { "cc": "AZN", "symbol": "AZN", "name": "Azerbaijani manat" },
    { "cc": "BAM", "symbol": "KM", "name": "Bosnia and Herzegovina konvertibilna marka" },
    { "cc": "BBD", "symbol": "Bds$", "name": "Barbadian dollar" },
    { "cc": "BDT", "symbol": "\u09f3", "name": "Bangladeshi taka" },
    { "cc": "BGN", "symbol": "BGN", "name": "Bulgarian lev" },
    { "cc": "BHD", "symbol": ".\u062f.\u0628", "name": "Bahraini dinar" },
    { "cc": "BIF", "symbol": "FBu", "name": "Burundi franc" },
    { "cc": "BMD", "symbol": "BD$", "name": "Bermudian dollar" },
    { "cc": "BND", "symbol": "B$", "name": "Brunei dollar" },
    { "cc": "BOB", "symbol": "Bs.", "name": "Bolivian boliviano" },
    { "cc": "BRL", "symbol": "R$", "name": "Brazilian real" },
    { "cc": "BSD", "symbol": "B$", "name": "Bahamian dollar" },
    { "cc": "BTN", "symbol": "Nu.", "name": "Bhutanese ngultrum" },
    { "cc": "BWP", "symbol": "P", "name": "Botswana pula" },
    { "cc": "BYR", "symbol": "Br", "name": "Belarusian ruble" },
    { "cc": "BZD", "symbol": "BZ$", "name": "Belize dollar" },
    { "cc": "CAD", "symbol": "$", "name": "Canadian dollar" },
    { "cc": "CDF", "symbol": "F", "name": "Congolese franc" },
    { "cc": "CHF", "symbol": "Fr.", "name": "Swiss franc" },
    { "cc": "CLP", "symbol": "$", "name": "Chilean peso" },
    { "cc": "CNY", "symbol": "\u00a5", "name": "Chinese/Yuan renminbi" },
    { "cc": "COP", "symbol": "Col$", "name": "Colombian peso" },
    { "cc": "CRC", "symbol": "\u20a1", "name": "Costa Rican colon" },
    { "cc": "CUC", "symbol": "$", "name": "Cuban peso" },
    { "cc": "CVE", "symbol": "Esc", "name": "Cape Verdean escudo" },
    { "cc": "CZK", "symbol": "K\u010d", "name": "Czech koruna" },
    { "cc": "DJF", "symbol": "Fdj", "name": "Djiboutian franc" },
    { "cc": "DKK", "symbol": "Kr", "name": "Danish krone" },
    { "cc": "DOP", "symbol": "RD$", "name": "Dominican peso" },
    { "cc": "DZD", "symbol": "\u062f.\u062c", "name": "Algerian dinar" },
    { "cc": "EEK", "symbol": "KR", "name": "Estonian kroon" },
    { "cc": "EGP", "symbol": "\u00a3", "name": "Egyptian pound" },
    { "cc": "ERN", "symbol": "Nfa", "name": "Eritrean nakfa" },
    { "cc": "ETB", "symbol": "Br", "name": "Ethiopian birr" },
    { "cc": "EUR", "symbol": "\u20ac", "name": "European Euro" },
    { "cc": "FJD", "symbol": "FJ$", "name": "Fijian dollar" },
    { "cc": "FKP", "symbol": "\u00a3", "name": "Falkland Islands pound" },
    { "cc": "GBP", "symbol": "\u00a3", "name": "British pound" },
    { "cc": "GEL", "symbol": "GEL", "name": "Georgian lari" },
    { "cc": "GHS", "symbol": "GH\u20b5", "name": "Ghanaian cedi" },
    { "cc": "GIP", "symbol": "\u00a3", "name": "Gibraltar pound" },
    { "cc": "GMD", "symbol": "D", "name": "Gambian dalasi" },
    { "cc": "GNF", "symbol": "FG", "name": "Guinean franc" },
    { "cc": "GQE", "symbol": "CFA", "name": "Central African CFA franc" },
    { "cc": "GTQ", "symbol": "Q", "name": "Guatemalan quetzal" },
    { "cc": "GYD", "symbol": "GY$", "name": "Guyanese dollar" },
    { "cc": "HKD", "symbol": "HK$", "name": "Hong Kong dollar" },
    { "cc": "HNL", "symbol": "L", "name": "Honduran lempira" },
    { "cc": "HRK", "symbol": "kn", "name": "Croatian kuna" },
    { "cc": "HTG", "symbol": "G", "name": "Haitian gourde" },
    { "cc": "HUF", "symbol": "Ft", "name": "Hungarian forint" },
    { "cc": "IDR", "symbol": "Rp", "name": "Indonesian rupiah" },
    { "cc": "ILS", "symbol": "\u20aa", "name": "Israeli new sheqel" },
    { "cc": "INR", "symbol": "\u20B9", "name": "Indian rupee" },
    { "cc": "IQD", "symbol": "\u062f.\u0639", "name": "Iraqi dinar" },
    { "cc": "IRR", "symbol": "IRR", "name": "Iranian rial" },
    { "cc": "ISK", "symbol": "kr", "name": "Icelandic kr\u00f3na" },
    { "cc": "JMD", "symbol": "J$", "name": "Jamaican dollar" },
    { "cc": "JOD", "symbol": "JOD", "name": "Jordanian dinar" },
    { "cc": "JPY", "symbol": "\u00a5", "name": "Japanese yen" },
    { "cc": "KES", "symbol": "KSh", "name": "Kenyan shilling" },
    { "cc": "KGS", "symbol": "\u0441\u043e\u043c", "name": "Kyrgyzstani som" },
    { "cc": "KHR", "symbol": "\u17db", "name": "Cambodian riel" },
    { "cc": "KMF", "symbol": "KMF", "name": "Comorian franc" },
    { "cc": "KPW", "symbol": "W", "name": "North Korean won" },
    { "cc": "KRW", "symbol": "W", "name": "South Korean won" },
    { "cc": "KWD", "symbol": "KWD", "name": "Kuwaiti dinar" },
    { "cc": "KYD", "symbol": "KY$", "name": "Cayman Islands dollar" },
    { "cc": "KZT", "symbol": "T", "name": "Kazakhstani tenge" },
    { "cc": "LAK", "symbol": "KN", "name": "Lao kip" },
    { "cc": "LBP", "symbol": "\u00a3", "name": "Lebanese lira" },
    { "cc": "LKR", "symbol": "Rs", "name": "Sri Lankan rupee" },
    { "cc": "LRD", "symbol": "L$", "name": "Liberian dollar" },
    { "cc": "LSL", "symbol": "M", "name": "Lesotho loti" },
    { "cc": "LTL", "symbol": "Lt", "name": "Lithuanian litas" },
    { "cc": "LVL", "symbol": "Ls", "name": "Latvian lats" },
    { "cc": "LYD", "symbol": "LD", "name": "Libyan dinar" },
    { "cc": "MAD", "symbol": "MAD", "name": "Moroccan dirham" },
    { "cc": "MDL", "symbol": "MDL", "name": "Moldovan leu" },
    { "cc": "MGA", "symbol": "FMG", "name": "Malagasy ariary" },
    { "cc": "MKD", "symbol": "MKD", "name": "Macedonian denar" },
    { "cc": "MMK", "symbol": "K", "name": "Myanma kyat" },
    { "cc": "MNT", "symbol": "\u20ae", "name": "Mongolian tugrik" },
    { "cc": "MOP", "symbol": "P", "name": "Macanese pataca" },
    { "cc": "MRO", "symbol": "UM", "name": "Mauritanian ouguiya" },
    { "cc": "MUR", "symbol": "Rs", "name": "Mauritian rupee" },
    { "cc": "MVR", "symbol": "Rf", "name": "Maldivian rufiyaa" },
    { "cc": "MWK", "symbol": "MK", "name": "Malawian kwacha" },
    { "cc": "MXN", "symbol": "$", "name": "Mexican peso" },
    { "cc": "MYR", "symbol": "RM", "name": "Malaysian ringgit" },
    { "cc": "MZM", "symbol": "MTn", "name": "Mozambican metical" },
    { "cc": "NAD", "symbol": "N$", "name": "Namibian dollar" },
    { "cc": "NGN", "symbol": "\u20a6", "name": "Nigerian naira" },
    { "cc": "NIO", "symbol": "C$", "name": "Nicaraguan c\u00f3rdoba" },
    { "cc": "NOK", "symbol": "kr", "name": "Norwegian krone" },
    { "cc": "NPR", "symbol": "NRs", "name": "Nepalese rupee" },
    { "cc": "NZD", "symbol": "NZ$", "name": "New Zealand dollar" },
    { "cc": "OMR", "symbol": "OMR", "name": "Omani rial" },
    { "cc": "PAB", "symbol": "B./", "name": "Panamanian balboa" },
    { "cc": "PEN", "symbol": "S/.", "name": "Peruvian nuevo sol" },
    { "cc": "PGK", "symbol": "K", "name": "Papua New Guinean kina" },
    { "cc": "PHP", "symbol": "\u20b1", "name": "Philippine peso" },
    { "cc": "PKR", "symbol": "Rs.", "name": "Pakistani rupee" },
    { "cc": "PLN", "symbol": "z\u0142", "name": "Polish zloty" },
    { "cc": "PYG", "symbol": "\u20b2", "name": "Paraguayan guarani" },
    { "cc": "QAR", "symbol": "QR", "name": "Qatari riyal" },
    { "cc": "RON", "symbol": "L", "name": "Romanian leu" },
    { "cc": "RSD", "symbol": "din.", "name": "Serbian dinar" },
    { "cc": "RUB", "symbol": "R", "name": "Russian ruble" },
    { "cc": "SAR", "symbol": "SR", "name": "Saudi riyal" },
    { "cc": "SBD", "symbol": "SI$", "name": "Solomon Islands dollar" },
    { "cc": "SCR", "symbol": "SR", "name": "Seychellois rupee" },
    { "cc": "SDG", "symbol": "SDG", "name": "Sudanese pound" },
    { "cc": "SEK", "symbol": "kr", "name": "Swedish krona" },
    { "cc": "SGD", "symbol": "S$", "name": "Singapore dollar" },
    { "cc": "SHP", "symbol": "\u00a3", "name": "Saint Helena pound" },
    { "cc": "SLL", "symbol": "Le", "name": "Sierra Leonean leone" },
    { "cc": "SOS", "symbol": "Sh.", "name": "Somali shilling" },
    { "cc": "SRD", "symbol": "$", "name": "Surinamese dollar" },
    { "cc": "SYP", "symbol": "LS", "name": "Syrian pound" },
    { "cc": "SZL", "symbol": "E", "name": "Swazi lilangeni" },
    { "cc": "THB", "symbol": "\u0e3f", "name": "Thai baht" },
    { "cc": "TJS", "symbol": "TJS", "name": "Tajikistani somoni" },
    { "cc": "TMT", "symbol": "m", "name": "Turkmen manat" },
    { "cc": "TND", "symbol": "DT", "name": "Tunisian dinar" },
    { "cc": "TRY", "symbol": "TRY", "name": "Turkish new lira" },
    { "cc": "TTD", "symbol": "TT$", "name": "Trinidad and Tobago dollar" },
    { "cc": "TWD", "symbol": "NT$", "name": "New Taiwan dollar" },
    { "cc": "TZS", "symbol": "TZS", "name": "Tanzanian shilling" },
    { "cc": "UAH", "symbol": "UAH", "name": "Ukrainian hryvnia" },
    { "cc": "UGX", "symbol": "USh", "name": "Ugandan shilling" },
    { "cc": "USD", "symbol": "US$", "name": "United States dollar" },
    { "cc": "UYU", "symbol": "$U", "name": "Uruguayan peso" },
    { "cc": "UZS", "symbol": "UZS", "name": "Uzbekistani som" },
    { "cc": "VEB", "symbol": "Bs", "name": "Venezuelan bolivar" },
    { "cc": "VND", "symbol": "\u20ab", "name": "Vietnamese dong" },
    { "cc": "VUV", "symbol": "VT", "name": "Vanuatu vatu" },
    { "cc": "WST", "symbol": "WS$", "name": "Samoan tala" },
    { "cc": "XAF", "symbol": "CFA", "name": "Central African CFA franc" },
    { "cc": "XCD", "symbol": "EC$", "name": "East Caribbean dollar" },
    { "cc": "XDR", "symbol": "SDR", "name": "Special Drawing Rights" },
    { "cc": "XOF", "symbol": "CFA", "name": "West African CFA franc" },
    { "cc": "XPF", "symbol": "F", "name": "CFP franc" },
    { "cc": "YER", "symbol": "YER", "name": "Yemeni rial" },
    { "cc": "ZAR", "symbol": "R", "name": "South African rand" },
    { "cc": "ZMK", "symbol": "ZK", "name": "Zambian kwacha" },
    { "cc": "ZWR", "symbol": "Z$", "name": "Zimbabwean dollar" }
];

// Sample payment gateways with relations
const gateways = [
    {
        name: 'Stripe',
        slug: 'stripe',
        description: 'Leading global payment processor for SaaS, Marketplaces, and e-commerce.',
        logo_url: 'https://stripe.com/img/v3/home/social.png',
        website_url: 'https://stripe.com',
        countries_codes: ['US', 'CA', 'GB', 'NG', 'ZA', 'KE', 'DE', 'FR'],
        currencies_codes: ['USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'KES'],
        crypto_supported: ['USDC'],
        integration_type: ['API', 'Mobile SDK', 'Marketplace', 'Recurring Billing', 'No Code'],
        business_type: ['Processor', 'Gateway'],
        fees: { transaction_fee: '2.9% + $0.30', setup_fee: '$0', monthly_fee: '$0' },
        local_fee_percentage: 2.9,
        local_fee_fixed: 0.30,
        local_fee_currency: 'USD',
        international_fee_percentage: 3.9,
        international_fee_fixed: 0.30,
        international_fee_currency: 'USD',
        setup_fee: 0,
        monthly_fee: 0,
        fee_currency: 'USD',
        settlement_hours: 48,  // T+2
        payment_methods: {
            'US': ['Cards', 'ACH', 'Wire', 'Apple Pay', 'Google Pay'],
            'CA': ['Cards', 'Interac', 'Apple Pay'],
            'GB': ['Cards', 'Open Banking', 'Apple Pay', 'Google Pay'],
            'NG': ['Cards', 'Bank Transfer'],
            'ZA': ['Cards', 'EFT', 'Instant EFT'],
            'KE': ['Cards', 'M-Pesa'],
            'DE': ['Cards', 'SEPA', 'Giropay', 'Klarna'],
            'FR': ['Cards', 'SEPA', 'Cartes Bancaires']
        },
        settlement_speed: 'T+2',
        startup_offer: 'No setup fees for first 6 months',
        status_slot: 'featured',
    },
    // ... (other gateways can be added similarly, shortened for brevity if needed or keep full)
    {
        name: 'PayPal',
        slug: 'paypal',
        description: 'Trusted payment solution with worldwide recognition and buyer protection.',
        logo_url: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
        website_url: 'https://paypal.com',
        countries_codes: ['US', 'CA', 'GB', 'NG', 'ZA', 'KE', 'IN', 'AU'],
        currencies_codes: ['USD', 'EUR', 'GBP', 'INR', 'AUD'],
        crypto_supported: ['BTC', 'ETH', 'LTC'],
        integration_type: ['API', 'Hosted', 'No Code', 'Recurring Billing'],
        business_type: ['Aggregator', 'Processor'],
        fees: { transaction_fee: '3.49% + fixed', setup_fee: '$0', monthly_fee: '$0' },
        local_fee_percentage: 3.49,
        local_fee_fixed: 0.49,
        local_fee_currency: 'USD',
        international_fee_percentage: 4.99,
        international_fee_fixed: 0.49,
        international_fee_currency: 'USD',
        setup_fee: 0,
        monthly_fee: 0,
        fee_currency: 'USD',
        settlement_hours: 0,  // Instant
        settlement_speed: 'Instant',
        startup_offer: null,
        status_slot: 'active',
    },
    {
        name: 'Flutterwave',
        slug: 'flutterwave',
        description: 'Sell to anyone, anywhere in the world. The easiest way to make and accept payments in Africa.',
        logo_url: 'https://flutterwave.com/images/logo/full.svg',
        website_url: 'https://flutterwave.com',
        countries_codes: ['NG', 'US', 'GB', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'MW'], // XAF/XOF mapped to countries not in list, skipping specific codes for brevity
        currencies_codes: ['NGN', 'USD', 'EUR', 'GBP', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'XAF', 'XOF'],
        crypto_supported: [],
        integration_type: ['API', 'Mobile SDK', 'Marketplace', 'International'],
        business_type: ['Aggregator', 'Gateway'],
        fees: { transaction_fee: '1.4%', setup_fee: '$0', monthly_fee: '$0' },
        local_fee_percentage: 1.4,
        local_fee_fixed: 0,
        local_fee_currency: 'USD',
        international_fee_percentage: 3.8,
        international_fee_fixed: 0,
        international_fee_currency: 'USD',
        setup_fee: 0,
        monthly_fee: 0,
        fee_currency: 'USD',
        settlement_hours: 24,  // T+1
        settlement_speed: 'T+1',
        startup_offer: 'First $1000 free',
        status_slot: 'featured',
    },
    {
        name: 'Paystack',
        slug: 'paystack',
        description: 'Modern online and offline payments for Africa. Stripe for Africa.',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Paystack_Logo.png',
        website_url: 'https://paystack.com',
        countries_codes: ['NG', 'GH', 'ZA', 'KE'],
        currencies_codes: ['NGN', 'GHS', 'ZAR', 'USD', 'KES'],
        crypto_supported: [],
        integration_type: ['API', 'Mobile SDK', 'No Code', 'Recurring Billing'],
        business_type: ['Aggregator'],
        fees: { transaction_fee: '1.5% + ₦100', setup_fee: '$0', monthly_fee: '$0' },
        settlement_speed: 'T+1',
        startup_offer: 'Free integration support',
        status_slot: 'featured',
    },
    {
        name: 'Razorpay',
        slug: 'razorpay',
        description: 'Powering your finance growth with supercharged payments in India.',
        logo_url: 'https://razorpay.com/assets/razorpay-glyph.svg',
        website_url: 'https://razorpay.com',
        countries_codes: ['IN'],
        currencies_codes: ['INR', 'USD'],
        crypto_supported: [],
        integration_type: ['API', 'Mobile SDK', 'No Code', 'Marketplace'],
        fees: { transaction_fee: '2%', setup_fee: '$0', monthly_fee: '$0' },
        settlement_speed: 'T+2',
        startup_offer: null,
        status_slot: 'active',
    }
];

async function seed() {
    config();

    const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'payment_gateway_db',
        entities: [PaymentGateway, Country, Currency, Sponsor, FounderOffer], // Added Currency
        synchronize: true,
    });

    await dataSource.initialize();
    console.log('✅ Database connected');

    // Clear existing data (disable FK checks)
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    // Truncate tables including junction tables
    await dataSource.query('TRUNCATE TABLE payment_gateways_countries');
    await dataSource.query('TRUNCATE TABLE payment_gateways_currencies');
    await dataSource.getRepository(FounderOffer).clear();
    await dataSource.getRepository(Sponsor).clear();
    await dataSource.getRepository(PaymentGateway).clear();
    await dataSource.getRepository(Country).clear();
    await dataSource.getRepository(Currency).clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🗑️  Cleared existing data');

    // Seed Countries
    const countryRepo = dataSource.getRepository(Country);
    const countryEntities = countriesList.map(c => countryRepo.create({
        name: c.name,
        code: c.code,
        slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        local_currencies: [], // Default empty
    }));
    await countryRepo.save(countryEntities);
    console.log(`✅ Seeded ${countryEntities.length} countries`);

    // Seed Currencies
    const currencyRepo = dataSource.getRepository(Currency);
    const currencyEntities = currenciesList.map(c => currencyRepo.create({
        code: c.cc,
        name: c.name,
        symbol: c.symbol
    }));
    await currencyRepo.save(currencyEntities);
    console.log(`✅ Seeded ${currencyEntities.length} currencies`);

    // Seed Gateways
    const gatewayRepo = dataSource.getRepository(PaymentGateway);
    const savedGateways: PaymentGateway[] = [];

    for (const g of gateways) {
        const gateway = gatewayRepo.create({
            name: g.name,
            slug: g.slug,
            description: g.description,
            logo_url: g.logo_url,
            website_url: g.website_url,
            crypto_supported: g.crypto_supported,
            integration_type: g.integration_type,
            business_type: g.business_type,
            fees: g.fees,
            payment_methods: g.payment_methods as any,
            settlement_speed: g.settlement_speed,
            startup_offer: g.startup_offer,
            status_slot: g.status_slot,
            fit_score: 0,
        });

        // Resolve relations
        if (g.countries_codes) {
            const countries = await countryRepo.find({ where: { code: In(g.countries_codes) } });
            gateway.countries = countries;
        }

        if (g.currencies_codes) {
            const currencies = await currencyRepo.find({ where: { code: In(g.currencies_codes) } });
            gateway.currencies = currencies;
        }

        const saved = await gatewayRepo.save(gateway);
        savedGateways.push(saved);
    }
    console.log(`✅ Seeded ${savedGateways.length} payment gateways with relations`);

    // Seed Sponsors
    const sponsorRepo = dataSource.getRepository(Sponsor);
    const sponsors = savedGateways.filter(g => g.status_slot === 'featured').slice(0, 4).map((gateway, index) => ({
        gateway_id: gateway.id,
        is_featured: true,
        display_order: index,
        recommended_badge: index === 0,
        monthly_price: 99 + index * 50,
    }));
    await sponsorRepo.save(sponsors as any);
    console.log(`✅ Seeded ${sponsors.length} sponsors`);

    // Seed Offers
    const offerRepo = dataSource.getRepository(FounderOffer);
    if (savedGateways.length > 0) {
        const stripe = savedGateways.find(g => g.slug === 'stripe') || savedGateways[0];
        const offers = [
            {
                gateway_id: stripe.id,
                title: '50% off for 6 months',
                description: 'Get 50% off transaction fees for the first 6 months',
                countries: ['US', 'CA', 'GB'],
                currencies: ['USD', 'CAD', 'GBP'],
                crypto: [],
                discount: '50% off',
                expires_at: new Date('2026-12-31'),
            }
        ];
        await offerRepo.save(offers);
        console.log(`✅ Seeded ${offers.length} founder offers`);
    }

    await dataSource.destroy();
    console.log('🎉 Database seeding completed!');
}

seed().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
