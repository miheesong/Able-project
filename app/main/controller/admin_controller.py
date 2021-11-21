from flask import Blueprint, render_template, redirect, url_for

admin_route = Blueprint('admin_route', __name__, url_prefix="/admin")

@admin_route.route('/', methods=['GET'])
def main():
  return "Thie is admin page"