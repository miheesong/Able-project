import os
import unittest

from flask_migrate import Migrate # , MigrateCommand
from flask_script import Manager

from app import blueprint,blueprint_route
from app.main import create_app

app = create_app(os.getenv('FLASK_ENV') or 'dev')
app.register_blueprint(blueprint)
app.register_blueprint(blueprint_route)
app.app_context().push()

manager = Manager(app)
migrate = Migrate(app)
# manager.add_command('db', MigrateCommand)

@manager.command
def run():
  """Run Flask server"""
  #app.debug = True
  app.run(host='0.0.0.0', debug=True,port=5000)


if __name__ == '__main__':
    #manager.debug = True
    manager.run()
