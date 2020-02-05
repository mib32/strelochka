// .pride {
//   width: 159px;
//   top: 14px;
//   position: absolute;
//   left: 94px;
// }
//
// .pride-logo {
//   content: url(./images/strelochka.png);
// }
//
// .pride-mobile {
//   margin-top: 20px;
//   margin-bottom: 8px;
//   margin-left: 12px;
//   max-width: 130px;
// }

export default function(props) {
  return(props.mobile ? <img className="pride-mobile pride-logo" alt="Стрелочка" /> : <img className="pride pride-logo" alt="Стрелочка" />)
}
