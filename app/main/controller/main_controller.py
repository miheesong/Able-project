import os

from flask import Blueprint, render_template, redirect, url_for, request, send_from_directory

user_route = Blueprint('user_route', __name__)

@user_route.route('/', methods=['GET'])
def main():
  return render_template('index.html', title="메인")

@user_route.app_errorhandler(404)
def not_find(err):
  return render_template('common/404.html', title="404"), 404

@user_route.app_errorhandler(500)
def internal_error(err):
  return render_template('common/500.html', title="500"), 500