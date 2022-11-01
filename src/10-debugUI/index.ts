import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import Stats from '../common/stats'
import { listenResize } from '../common/utils'

const canvas = document.querySelector('#mainCanvas')
