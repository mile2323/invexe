from django import template
import math

register = template.Library()

@register.filter
def floatval(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0

@register.filter
def mul(value, arg):
    """Multiplies the value by the argument."""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return 0

@register.filter
def div(value, arg):
    """Divides the value by the argument."""
    try:
        return float(value) / float(arg)
    except (ValueError, TypeError, ZeroDivisionError):
        return 0

@register.filter
def floatval(value):
    """Converts the value to a float."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0

@register.filter
def sub(value, arg):
    """Subtracts the argument from the value."""
    try:
        return float(value) - float(arg)
    except (ValueError, TypeError):
        return 0
    
@register.filter
def floor(value):
    """Rounds down the value to the nearest integer."""
    try:
        return math.floor(float(value))
    except (ValueError, TypeError):
        return 0