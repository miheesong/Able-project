import os

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app import blueprint, blueprint_route, blueprint_admin_route
from app import create_app, db

app = create_app(os.getenv('FLASK_ENV') or 'dev')
app.register_blueprint(blueprint)
app.register_blueprint(blueprint_route)
app.register_blueprint(blueprint_admin_route)
app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)


@manager.command
def run():
  """Run Flask server"""
  app.run(host='0.0.0.0', port=5000)



if __name__ == '__main__':
    manager.run()
