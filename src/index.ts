import { Sign3D } from "./lib";
function init() {
  // @ts-ignore
  const sign3d = window.sign3d = new Sign3D({
    dom: document.getElementById('webgl'),
    backgroundImage: 'http://img.eventist.cn/hudong/threeBg.jpg',
    backgroundType: '2D',
    shape: 'Circle',
    shineColor: '#FCECB7',
    openAnimates: ['Sphere', 'Logo', 'Artascope', 'Grid', 'Helix'],
    callback: (status) => {
      console.log(status)
    },
    tableData: [
      ['8', '0'], ['9', '0'], ['10', '0'], ['29', '0'], ['30', '0'], ['31', '0'], ['32', '0'], ['33', '0'], ['34', '0'], ['35', '0'], ['36', '0'], ['52', '0'], ['53', '0'], ['54', '0'], ['8', '1'], ['9', '1'], ['10', '1'], ['28', '1'], ['29', '1'], ['30', '1'], ['31', '1'], ['32', '1'], ['33', '1'], ['34', '1'], ['35', '1'], ['36', '1'], ['37', '1'], ['52', '1'], ['53', '1'], ['54', '1'], ['8', '2'], ['9', '2'], ['10', '2'], ['27', '2'], ['28', '2'], ['29', '2'], ['30', '2'], ['31', '2'], ['32', '2'], ['33', '2'], ['34', '2'], ['35', '2'], ['36', '2'], ['37', '2'], ['45', '2'], ['46', '2'], ['47', '2'], ['48', '2'], ['49', '2'], ['50', '2'], ['51', '2'], ['52', '2'], ['53', '2'], ['54', '2'], ['55', '2'], ['56', '2'], ['57', '2'], ['58', '2'], ['59', '2'], ['60', '2'], ['61', '2'], ['62', '2'], ['63', '2'], ['3', '3'], ['4', '3'], ['5', '3'], ['6', '3'], ['7', '3'], ['8', '3'], ['9', '3'], ['10', '3'], ['11', '3'], ['12', '3'], ['13', '3'], ['14', '3'], ['15', '3'], ['16', '3'], ['27', '3'], ['28', '3'], ['29', '3'], ['30', '3'], ['35', '3'], ['36', '3'], ['37', '3'], ['38', '3'], ['45', '3'], ['46', '3'], ['47', '3'], ['48', '3'], ['49', '3'], ['50', '3'], ['51', '3'], ['52', '3'], ['53', '3'], ['54', '3'], ['55', '3'], ['56', '3'], ['57', '3'], ['58', '3'], ['59', '3'], ['60', '3'], ['61', '3'], ['62', '3'], ['63', '3'], ['3', '4'], ['4', '4'], ['5', '4'], ['6', '4'], ['7', '4'], ['8', '4'], ['9', '4'], ['10', '4'], ['11', '4'], ['12', '4'], ['13', '4'], ['14', '4'], ['15', '4'], ['16', '4'], ['26', '4'], ['27', '4'], ['28', '4'], ['29', '4'], ['36', '4'], ['37', '4'], ['38', '4'], ['39', '4'], ['45', '4'], ['46', '4'], ['47', '4'], ['48', '4'], ['49', '4'], ['50', '4'], ['51', '4'], ['52', '4'], ['53', '4'], ['54', '4'], ['55', '4'], ['56', '4'], ['57', '4'], ['58', '4'], ['59', '4'], ['60', '4'], ['61', '4'], ['62', '4'], ['63', '4'], ['3', '5'], ['4', '5'], ['5', '5'], ['6', '5'], ['7', '5'], ['8', '5'], ['9', '5'], ['10', '5'], ['11', '5'], ['12', '5'], ['13', '5'], ['14', '5'], ['15', '5'], ['16', '5'], ['25', '5'], ['26', '5'], ['27', '5'], ['28', '5'], ['36', '5'], ['37', '5'], ['38', '5'], ['39', '5'], ['44', '5'], ['45', '5'], ['46', '5'], ['47', '5'], ['61', '5'], ['62', '5'], ['63', '5'], ['7', '6'], ['8', '6'], ['9', '6'], ['14', '6'], ['15', '6'], ['16', '6'], ['25', '6'], ['26', '6'], ['27', '6'], ['28', '6'], ['29', '6'], ['36', '6'], ['37', '6'], ['38', '6'], ['39', '6'], ['40', '6'], ['44', '6'], ['45', '6'], ['46', '6'], ['49', '6'], ['50', '6'], ['51', '6'], ['52', '6'], ['53', '6'], ['54', '6'], ['55', '6'], ['56', '6'], ['57', '6'], ['58', '6'], ['59', '6'], ['61', '6'], ['62', '6'], ['63', '6'], ['7', '7'], ['8', '7'], ['9', '7'], ['14', '7'], ['15', '7'], ['16', '7'], ['18', '7'], ['19', '7'], ['20', '7'], ['24', '7'], ['25', '7'], ['26', '7'], ['27', '7'], ['28', '7'], ['29', '7'], ['30', '7'], ['31', '7'], ['32', '7'], ['33', '7'], ['34', '7'], ['35', '7'], ['36', '7'], ['37', '7'], ['38', '7'], ['39', '7'], ['40', '7'], ['41', '7'], ['44', '7'], ['45', '7'], ['46', '7'], ['48', '7'], ['49', '7'], ['50', '7'], ['51', '7'], ['52', '7'], ['53', '7'], ['54', '7'], ['55', '7'], ['56', '7'], ['57', '7'], ['58', '7'], ['59', '7'], ['61', '7'], ['62', '7'], ['63', '7'], ['2', '8'], ['3', '8'], ['4', '8'], ['6', '8'], ['7', '8'], ['8', '8'], ['9', '8'], ['14', '8'], ['15', '8'], ['16', '8'], ['18', '8'], ['19', '8'], ['20', '8'], ['23', '8'], ['24', '8'], ['25', '8'], ['26', '8'], ['28', '8'], ['29', '8'], ['30', '8'], ['31', '8'], ['32', '8'], ['33', '8'], ['34', '8'], ['35', '8'], ['36', '8'], ['38', '8'], ['39', '8'], ['40', '8'], ['41', '8'], ['49', '8'], ['50', '8'], ['51', '8'], ['52', '8'], ['53', '8'], ['54', '8'], ['2', '9'], ['3', '9'], ['4', '9'], ['6', '9'], ['7', '9'], ['8', '9'], ['9', '9'], ['14', '9'], ['15', '9'], ['16', '9'], ['18', '9'], ['19', '9'], ['20', '9'], ['23', '9'], ['24', '9'], ['25', '9'], ['26', '9'], ['28', '9'], ['29', '9'], ['35', '9'], ['36', '9'], ['39', '9'], ['40', '9'], ['41', '9'], ['42', '9'], ['48', '9'], ['49', '9'], ['50', '9'], ['51', '9'], ['52', '9'], ['61', '9'], ['62', '9'], ['2', '10'], ['3', '10'], ['4', '10'], ['6', '10'], ['7', '10'], ['8', '10'], ['14', '10'], ['15', '10'], ['16', '10'], ['18', '10'], ['19', '10'], ['20', '10'], ['46', '10'], ['47', '10'], ['48', '10'], ['49', '10'], ['50', '10'], ['53', '10'], ['54', '10'], ['55', '10'], ['59', '10'], ['60', '10'], ['61', '10'], ['62', '10'], ['1', '11'], ['2', '11'], ['3', '11'], ['4', '11'], ['6', '11'], ['7', '11'], ['8', '11'], ['14', '11'], ['15', '11'], ['16', '11'], ['18', '11'], ['19', '11'], ['20', '11'], ['23', '11'], ['24', '11'], ['25', '11'], ['26', '11'], ['27', '11'], ['28', '11'], ['29', '11'], ['30', '11'], ['31', '11'], ['32', '11'], ['33', '11'], ['34', '11'], ['35', '11'], ['36', '11'], ['37', '11'], ['38', '11'], ['39', '11'], ['40', '11'], ['41', '11'], ['42', '11'], ['44', '11'], ['45', '11'], ['46', '11'], ['47', '11'], ['48', '11'], ['51', '11'], ['52', '11'], ['53', '11'], ['54', '11'], ['55', '11'], ['57', '11'], ['58', '11'], ['59', '11'], ['60', '11'], ['61', '11'], ['62', '11'], ['1', '12'], ['2', '12'], ['3', '12'], ['6', '12'], ['7', '12'], ['8', '12'], ['14', '12'], ['15', '12'], ['16', '12'], ['18', '12'], ['19', '12'], ['20', '12'], ['23', '12'], ['24', '12'], ['25', '12'], ['26', '12'], ['27', '12'], ['28', '12'], ['29', '12'], ['30', '12'], ['31', '12'], ['32', '12'], ['33', '12'], ['34', '12'], ['35', '12'], ['36', '12'], ['37', '12'], ['38', '12'], ['39', '12'], ['40', '12'], ['41', '12'], ['42', '12'], ['44', '12'], ['45', '12'], ['46', '12'], ['49', '12'], ['50', '12'], ['51', '12'], ['52', '12'], ['53', '12'], ['54', '12'], ['55', '12'], ['57', '12'], ['58', '12'], ['59', '12'], ['60', '12'], ['61', '12'], ['1', '13'], ['2', '13'], ['3', '13'], ['5', '13'], ['6', '13'], ['7', '13'], ['8', '13'], ['14', '13'], ['15', '13'], ['16', '13'], ['18', '13'], ['19', '13'], ['20', '13'], ['23', '13'], ['24', '13'], ['25', '13'], ['26', '13'], ['27', '13'], ['28', '13'], ['29', '13'], ['30', '13'], ['31', '13'], ['32', '13'], ['33', '13'], ['34', '13'], ['35', '13'], ['36', '13'], ['37', '13'], ['38', '13'], ['39', '13'], ['40', '13'], ['41', '13'], ['42', '13'], ['44', '13'], ['47', '13'], ['48', '13'], ['49', '13'], ['50', '13'], ['51', '13'], ['52', '13'], ['53', '13'], ['54', '13'], ['55', '13'], ['57', '13'], ['58', '13'], ['59', '13'], ['1', '14'], ['2', '14'], ['3', '14'], ['5', '14'], ['6', '14'], ['7', '14'], ['8', '14'], ['14', '14'], ['15', '14'], ['16', '14'], ['18', '14'], ['19', '14'], ['20', '14'], ['23', '14'], ['24', '14'], ['25', '14'], ['26', '14'], ['27', '14'], ['28', '14'], ['29', '14'], ['30', '14'], ['31', '14'], ['32', '14'], ['33', '14'], ['34', '14'], ['35', '14'], ['36', '14'], ['37', '14'], ['38', '14'], ['39', '14'], ['40', '14'], ['41', '14'], ['42', '14'], ['45', '14'], ['46', '14'], ['47', '14'], ['48', '14'], ['49', '14'], ['50', '14'], ['53', '14'], ['54', '14'], ['55', '14'], ['57', '14'], ['58', '14'], ['1', '15'], ['2', '15'], ['3', '15'], ['5', '15'], ['6', '15'], ['7', '15'], ['14', '15'], ['15', '15'], ['16', '15'], ['18', '15'], ['19', '15'], ['20', '15'], ['26', '15'], ['27', '15'], ['28', '15'], ['29', '15'], ['44', '15'], ['45', '15'], ['46', '15'], ['47', '15'], ['48', '15'], ['52', '15'], ['53', '15'], ['54', '15'], ['55', '15'], ['57', '15'], ['58', '15'], ['0', '16'], ['1', '16'], ['2', '16'], ['3', '16'], ['5', '16'], ['6', '16'], ['7', '16'], ['14', '16'], ['15', '16'], ['16', '16'], ['18', '16'], ['19', '16'], ['20', '16'], ['26', '16'], ['27', '16'], ['28', '16'], ['35', '16'], ['36', '16'], ['37', '16'], ['38', '16'], ['44', '16'], ['45', '16'], ['46', '16'], ['50', '16'], ['51', '16'], ['52', '16'], ['53', '16'], ['54', '16'], ['55', '16'], ['57', '16'], ['58', '16'], ['59', '16'], ['0', '17'], ['1', '17'], ['2', '17'], ['5', '17'], ['6', '17'], ['7', '17'], ['14', '17'], ['15', '17'], ['16', '17'], ['18', '17'], ['19', '17'], ['20', '17'], ['25', '17'], ['26', '17'], ['27', '17'], ['28', '17'], ['36', '17'], ['37', '17'], ['38', '17'], ['39', '17'], ['44', '17'], ['48', '17'], ['49', '17'], ['50', '17'], ['51', '17'], ['52', '17'], ['53', '17'], ['54', '17'], ['55', '17'], ['57', '17'], ['58', '17'], ['59', '17'], ['60', '17'], ['0', '18'], ['1', '18'], ['2', '18'], ['4', '18'], ['5', '18'], ['6', '18'], ['7', '18'], ['14', '18'], ['15', '18'], ['16', '18'], ['19', '18'], ['20', '18'], ['25', '18'], ['26', '18'], ['27', '18'], ['28', '18'], ['36', '18'], ['37', '18'], ['38', '18'], ['39', '18'], ['46', '18'], ['47', '18'], ['48', '18'], ['49', '18'], ['50', '18'], ['53', '18'], ['54', '18'], ['55', '18'], ['58', '18'], ['59', '18'], ['60', '18'], ['61', '18'], ['4', '19'], ['5', '19'], ['6', '19'], ['10', '19'], ['11', '19'], ['12', '19'], ['13', '19'], ['14', '19'], ['15', '19'], ['16', '19'], ['24', '19'], ['25', '19'], ['26', '19'], ['27', '19'], ['28', '19'], ['29', '19'], ['30', '19'], ['31', '19'], ['32', '19'], ['33', '19'], ['34', '19'], ['35', '19'], ['36', '19'], ['37', '19'], ['38', '19'], ['39', '19'], ['40', '19'], ['44', '19'], ['45', '19'], ['46', '19'], ['47', '19'], ['48', '19'], ['53', '19'], ['54', '19'], ['55', '19'], ['59', '19'], ['60', '19'], ['61', '19'], ['62', '19'], ['4', '20'], ['5', '20'], ['6', '20'], ['10', '20'], ['11', '20'], ['12', '20'], ['13', '20'], ['14', '20'], ['15', '20'], ['16', '20'], ['24', '20'], ['25', '20'], ['26', '20'], ['27', '20'], ['28', '20'], ['29', '20'], ['30', '20'], ['31', '20'], ['32', '20'], ['33', '20'], ['34', '20'], ['35', '20'], ['36', '20'], ['37', '20'], ['38', '20'], ['39', '20'], ['40', '20'], ['41', '20'], ['44', '20'], ['45', '20'], ['46', '20'], ['53', '20'], ['54', '20'], ['55', '20'], ['60', '20'], ['61', '20'], ['62', '20'], ['63', '20'], ['4', '21'], ['5', '21'], ['6', '21'], ['44', '21'], ['35', '24'], ['31', '25'], ['42', '25'], ['8', '26'], ['9', '26'], ['10', '26'], ['13', '26'], ['17', '26'], ['20', '26'], ['21', '26'], ['25', '26'], ['26', '26'], ['27', '26'], ['28', '26'], ['30', '26'], ['31', '26'], ['32', '26'], ['35', '26'], ['38', '26'], ['39', '26'], ['41', '26'], ['42', '26'], ['43', '26'], ['44', '26'], ['50', '26'], ['51', '26'], ['52', '26'], ['54', '26'], ['55', '26'], ['56', '26'], ['57', '26'], ['11', '27'], ['13', '27'], ['16', '27'], ['19', '27'], ['22', '27'], ['25', '27'], ['28', '27'], ['31', '27'], ['35', '27'], ['37', '27'], ['42', '27'], ['49', '27'], ['50', '27'], ['52', '27'], ['54', '27'], ['55', '27'], ['57', '27'], ['58', '27'], ['7', '28'], ['11', '28'], ['13', '28'], ['14', '28'], ['16', '28'], ['18', '28'], ['19', '28'], ['22', '28'], ['25', '28'], ['28', '28'], ['31', '28'], ['35', '28'], ['37', '28'], ['38', '28'], ['42', '28'], ['49', '28'], ['54', '28'], ['58', '28'], ['7', '29'], ['14', '29'], ['16', '29'], ['18', '29'], ['19', '29'], ['25', '29'], ['28', '29'], ['31', '29'], ['35', '29'], ['39', '29'], ['40', '29'], ['42', '29'], ['49', '29'], ['54', '29'], ['58', '29'], ['7', '30'], ['14', '30'], ['15', '30'], ['19', '30'], ['22', '30'], ['25', '30'], ['28', '30'], ['31', '30'], ['35', '30'], ['40', '30'], ['42', '30'], ['49', '30'], ['54', '30'], ['58', '30'], ['8', '31'], ['9', '31'], ['10', '31'], ['15', '31'], ['19', '31'], ['20', '31'], ['21', '31'], ['22', '31'], ['25', '31'], ['28', '31'], ['31', '31'], ['32', '31'], ['35', '31'], ['37', '31'], ['38', '31'], ['39', '31'], ['43', '31'], ['44', '31'], ['46', '31'], ['50', '31'], ['51', '31'], ['52', '31'], ['54', '31'], ['58', '31'], ['20', '28'], ['21', '28'], ['8', '28'], ['9', '28'], ['10', '28'], ['7', '27'], ['8', '30'], ['8', '29'],
      ['11', '30']
    ]
  });

  sign3d.users = [
    {
      openid: 11,
      avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/JqfbL9Z2prhybabOMfPUELUQAichrtTLCWFCUr6hTicMCE77qwSPsHm7wRNpzPY2kdG3RrlLco6shVAiatGtsIDgw/132',
      name: '答案'
    }
  ];
}
// @ts-ignore
window.init = init
init();
