from flask import Blueprint
from flask_restx import Api
from .main.controller.main_controller import user_route
from .main.controller.admin_controller import admin_route

blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
blueprint_route = user_route
blueprint_admin_route = admin_route


api = Api(blueprint,
          title="Able FLASK API WITH JWT",
          version='1.0',
          description='flask restx web service')