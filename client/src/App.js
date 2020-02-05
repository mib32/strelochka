import React, { Component } from 'react';
import './App.scss';
// import '../node_modules/reset-css/reset.css';
import DataLayer from  './components/DataLayer';
import GoogleFormButton from  './components/GoogleFormButton';
import { Helmet } from "react-helmet";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Hidden, Paper, Typography, Button, Input, Link } from '@material-ui/core';
import parovozImg from './images/parovozImg.jpg';
import { API_BASE, API_BASE_COM } from './consts.js'
import ruLocale from 'date-fns/locale/ru';
import { Waypoint } from 'react-waypoint';

class App extends Component {
  constructor() {
    super()
    this.state = {
      route: window.location.hash.substr(1),
      hideFeedbackButton: window.localStorage.getItem('hideFeedbackButton'),
      showYoutube: false,
      showTrain: false
    }
    this.handleHideFeedback = this.handleHideFeedback.bind(this)
    this.handleFeedbackNoticeClick = this.handleFeedbackNoticeClick.bind(this)
    this.handleBottomWaypointEnter = this.handleBottomWaypointEnter.bind(this)
    this.handleTrainWaypointEnter = this.handleTrainWaypointEnter.bind(this)
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      })
    })

    // const yaScript = document.createElement('script')
    // yaScript.setAttribute('type', 'text/javascript')
    // yaScript.innerHTML = `(function(w, d, n, s, t) {
    //     w[n] = w[n] || [];
    //     w[n].push(function() {
    //         window.Ya.Context.AdvManager.render({
    //             blockId: "R-A-395183-5",
    //             renderTo: "yandex_rtb_R-A-395183-5",
    //             async: true
    //         });
    //         window.Ya.Context.AdvManager.render({
    //             blockId: "R-A-395183-4",
    //             renderTo: "yandex_rtb_R-A-395183-4",
    //             async: true
    //         });
    //     });
    //     t = d.getElementsByTagName("script")[0];
    //     s = d.createElement("script");
    //     s.type = "text/javascript";
    //     s.src = "//an.yandex.ru/system/context.js";
    //     s.async = true;
    //     t.parentNode.insertBefore(s, t);
    // })(this, this.document, "yandexContextAsyncCallbacks");`
    // document.head.appendChild(yaScript)
  }

  handleHideFeedback() {
    window.localStorage.setItem('hideFeedbackButton', true)
    this.setState({hideFeedbackButton: true, showHideFeedbackNotice: true})
  }

  handleFeedbackNoticeClick() {
    this.setState({showHideFeedbackNotice: false})
  }

  handleBottomWaypointEnter() {
    this.setState({showYoutube: true})
  }

  handleTrainWaypointEnter() {
    this.setState({showTrain: true})
  }

  render() {
    const title = `Стрелочка - Календарь цен на ЖД билеты ${new Date().getFullYear()} | Легко сравнить цены на ЖД билеты, найти скидки и акции | Купить билеты дешево без наценки и комиссий на официальном сайте РЖД`
    const metaDesc = `Календарь цен на ЖД билеты - сравните цены на разные даты. Лучший способ прилично сэкономить на путешествии.`
    return(<div>
        <Helmet>
          <meta property="og:title" content="Стрелочка - Календарь цен на ЖД билеты" />
          <meta property="og:description" content={metaDesc} />
          <link href={API_BASE + window.location.pathname} hreflang="ru" rel="alternate" />
          <link href={API_BASE + window.location.pathname} hreflang="x-default" rel="alternate" />
          <link href={API_BASE_COM + '/by' + window.location.pathname} hreflang="ru-BY" rel="alternate" />
          <link href={API_BASE_COM + '/uz' + window.location.pathname} hreflang="ru-UZ" rel="alternate" />
          <link href={API_BASE_COM + '/kz' + window.location.pathname} hreflang="ru-KZ" rel="alternate" />
        </Helmet>
          {this.props.sPage ?
            <Helmet>
              <title>{this.props.match.params.from} - {this.props.match.params.to} | Цены на ЖД билеты на {ruLocale.localize.month(new Date().getMonth())} {new Date().getFullYear().toString()} | {title}</title>
              <meta name="description" content={`Цены в таблице на ближайшие дни. Находите скидки и невероятно низкие цены, в том числе с пересадками. Без наценки и комиссий.`} />
            </Helmet>
            :
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={metaDesc} />
            </Helmet>
          }

        <div className="App">
            <Hidden smDown implementation='css'>
                  <div className="App-header">
                    <h2>>>>> Стрелочка</h2>
                  </div>
                  <div className="wtf">
                    <h2>>>>>></h2>
                  </div>
            </Hidden>
            <Hidden mdUp implementation='css'>
              <Grid
                spacing={2}
                container
              >
                <Grid item xs={12}>
                  <div className="App-header-2">
                    <h2 style={{fontSize: '24px'}}>Стрелочка</h2>
                  </div>
                </Grid>
              </Grid>
            </Hidden>
          <Container maxWidth="lg">
            <Grid container justify="center" spacing={2} >
              <Grid container item justify="center" spacing={2} >
                {/*<Grid item md={8} >
                  <div className="" id="yandex_rtb_R-A-395183-5"></div>
                </Grid> */}
                <Grid item md={7}>
                  <h1 className="App-intro">
                    {this.props.sPage ?
                      `Календарь цен на ЖД билеты ${this.props.match.params.from} - ${this.props.match.params.to}`
                      :
                      "Календарь цен на ЖД билеты"
                    }
                  </h1>
                  <h2 className="App-intro-sm hidden-xs">
                    Сравните цены в разные дни и найдите самые дешевые билеты на поезд. Без наценки.
                  </h2>
                </Grid>
              </Grid>
              {this.state.showHideFeedbackNotice &&
                <Grid container item justify="center" onClick={this.handleFeedbackNoticeClick} spacing={2}>
                  <Grid item md={7} lg={6}>
                    Скрыто! Но если вы передумаете, вы можете оставить отзыв внизу страницы.
                  </Grid>
                </Grid>
              }
              { false && <blockquote className="blockquote-warning">24 - 25 Декабря на сайте были серьезные проблемы, но теперь всё в порядке.</blockquote>}
              {false && !this.state.hideFeedbackButton &&
                <Grid container item justify="center" spacing={2}>
                  <Grid item md={7} lg={6}>
                    <Paper style={{padding: 15}}>
                      <Grid container justify="space-between" >
                        <Typography component="p">
                          Пройдите пожалуйста опрос о Стрелочке
                        </Typography>
                       <GoogleFormButton
                         tabIndex={-1}
                         color="secondary"
                         size="small"
                         variant="contained"
                       >поделиться мнением</GoogleFormButton>
                       <Button tabIndex={-1} color="primary" size="small" variant="text" onClick={this.handleHideFeedback}>скрыть</Button>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              }
              <Grid container item justify="center" spacing={2}>
                <DataLayer
                  match={this.props.match}
                  history={this.props.history}
                  sPage={this.props.sPage}
                  />
              </Grid>
              <Grid container item justify="center" spacing={2}>
                <Grid item xs={12} md={7} lg={6}>
                  <Waypoint
                    onEnter={this.handleBottomWaypointEnter}
                  />
                  <Typography variant="h5" gutterBottom>Что такое Стрелочка?</Typography>
                  <Typography variant="body2" paragraph>Стрелочка не продаёт билеты, а помогает найти самые дешевые. Мы позволяем сравнить цены на разные даты, а потом направляем на официальный сайт РЖД для покупки. Без наценки и комиссий.</Typography>
                  <Typography variant="body2" paragraph>Так же, если поезд ходит редко, то Стрелочка поможет отловить его.</Typography>
                  <Typography variant="h5" gutterBottom>Как сэкономить на ЖД билетах?</Typography>
                  <Typography variant="body2" paragraph>Билеты на поезда РЖД в разные дни имеют разную стоимость, и порой цена дешевле в разы. Если вам не важно в какую дату ехать, с помощью Стрелочки вы можете легче найти правильную дату и таким образом сэкономить до нескольких тысяч рублей.</Typography>
                  <Typography variant="body2" paragraph>С помощью календаря также можно легко найти скидки и акции РЖД.</Typography>
                  <Typography variant="h5" gutterBottom>Как пользоваться Стрелочкой</Typography>
                  <Typography variant="body2" paragraph>Введите станцию отправления и прибытия, затем выберите диапазон дат когда вы готовы отправиться в путешествие. Нажмите "Поиск" и когда поиск закончится, в таблице нажмите на название колонки с типом вагона, например "Плацкарт" чтобы отсортировать по цене и найти дату с самым дешевым билетом. При нажатии на кнопку "Купить" мы переправим вас на официальный сайт РЖД для покупки билета.</Typography>
                  <Typography variant="subtitle1" gutterBottom>Видео-инструкция</Typography>
                  {this.state.showYoutube && <iframe className="responsiveEmbed videoInstructions" src="https://www.youtube.com/embed/VJvmB7lJ8kw" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
                  <Typography variant="h5" gutterBottom>Обратная связь</Typography>
                  <Typography variant="body2" paragraph>Около 80% функционала Стрелочки создано по просьбам пользователей. Если вам не хватает какой-то функции, вы нашли ошибку в сайте, или просто хотите чем-то поделиться - нажмите кнопку ниже и не забудьте оставить свой электронный адрес в форме. Мы отвечаем на все запросы, быстро.</Typography>
                  <Typography variant="body2" paragraph>Вы также можете написать в телеграм чат <a href="https://t.me/strelchkachat">@strelchkachat</a> и следить за обновлениями в канале <a href="https://t.me/strelchka">@strelchka</a>.</Typography>
                  <Typography variant="body2" paragraph><GoogleFormButton
                    color="secondary"
                    variant="contained"
                  >оставить отзыв</GoogleFormButton></Typography>
                  <Waypoint
                    onEnter={this.handleTrainWaypointEnter}
                  />
                  <Typography variant="h5" gutterBottom>Пожертвования</Typography>
                  <Typography variant="body2" paragraph>Стрелочке сейчас очень необходимы средства. Если вы можете поддержать нас, пожалуйста <a href="https://www.tinkoff.ru/sl/20Bbq8CHaxG" target="_blank">сделайте это на этой странице</a></Typography>
                  <Typography variant="h5" gutterBottom>Вакансии</Typography>
                  <Typography variant="subtitle1" gutterBottom>I. React-Разработчик — стажер</Typography>
                  <Typography variant="subtitle2" >Требования:</Typography>
                  <Typography variant="body2">- Знание React, любой уровень</Typography>
                  <Typography variant="body2" gutterBottom>- Умение работать в Git</Typography>
                  <Typography variant="body2" paragraph>Хотите опробвать свои знания в бою, и поработать бок о бок с нашим опытным разработчиком? Оставьте заявку. Свободный график, много интересных задач.</Typography>
                  <Button
                    href="https://docs.google.com/forms/d/e/1FAIpQLScwPb7FXyUTgN3KBdfgmy0d4nLDFYhRzFUM--5s6HFy6nJ5gg/viewform"
                    rel="noopener noreferrer"
                    target="_blank"
                    color="primary"
                    variant="contained"
                    >оставить заявку</Button>
                  {this.state.showTrain && <img alt="Train" className="img-responsive" src={parovozImg} />}
                  <Typography variant="subtitle1" align="center">Сделал <Link target="_blank" href="https://mibus32.wixsite.com/online">Антон Мурыгин</Link></Typography>
                  <Typography variant="subtitle1" align="center">2016 &ndash; {new Date().getFullYear()}</Typography>
                  <Typography variant="subtitle1" align="center">ТГ: <a href="https://t.me/strelchka">@strelchka</a>, <a href="https://t.me/strelchkachat">@strelchkachat</a></Typography>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </div>
    </div>
    );
  }
}

export default App;
