import React from 'react';

default export function SubscribeForm(props) {
  return(<form className="" action="/users" method="POST">
    <h4>Подписаться на обновления сервиса</h4>
    <div className="form-group">
      <Input className="form-control" type="email" name="email" placeholder='Электронная почта'/>
      <Button variant="outlined" style={{marginLeft: 10}} type="submit">Подписаться</Button>
    </div>
  </form>)
}
